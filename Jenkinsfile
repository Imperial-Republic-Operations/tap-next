pipeline {
	agent any

	tools {
		nodejs "Node 18"
	}

    environment {
		AWS_REGION = 'us-east-1'
        PROJECT_NAME = 'tap-app'
        ENVIRONMENT = 'staging'
        LIGHTSAIL_INSTANCE_NAME = "${PROJECT_NAME}-${ENVIRONMENT}"
        APP_VERSION = "${BUILD_NUMBER}"

        // AWS credentials - configure these in Jenkins credentials
        AWS_CREDENTIALS = credentials('aws-credentials')
        DOCKER_CREDENTIALS = credentials('docker-credentials')

        // Docker Hub configuration
        DOCKER_USERNAME = "${DOCKER_CREDENTIALS_USR}"
        DOCKER_REGISTRY = "docker.io"  // Docker Hub registry

        // Application specific environment variables
        NODE_ENV = 'development'
        PORT = '3000'

        // Staging-specific configurations
        DEBUG_MODE = 'true'
        LOG_LEVEL = 'debug'
        ENABLE_PROFILING = 'true'
    }

    options {
		buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    triggers {
		githubPush()
    }

    stages {
		/*stage('Checkout') {
			steps {
				checkout scm
                script {
					env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.IMAGE_TAG = "${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                }
            }
        }*/

        stage('Environment Setup') {
			steps {
				script {
					// Install or update AWS CLI if needed
                    sh '''
                        if ! command -v aws &> /dev/null; then
                            echo "Installing AWS CLI..."
                            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                            unzip awscliv2.zip
                            sudo ./aws/install
                        fi
                    '''

                    // Configure AWS credentials
                    sh '''
                        aws configure set aws_access_key_id ${AWS_CREDENTIALS_USR}
                        aws configure set aws_secret_access_key ${AWS_CREDENTIALS_PSW}
                        aws configure set region ${AWS_REGION}
                    '''
                }
            }
        }

        stage('Verify Node Installation') {
			steps {
				sh '''
                    echo "Node.js version:"
                    node --version
                    echo "npm version:"
                    npm --version
                '''
            }
        }

        stage('Build') {
			parallel {
				stage('Install Dependencies') {
					steps {
						script {
							if (fileExists('package.json')) {
								sh 'npm ci'
                            } else if (fileExists('requirements.txt')) {
								sh 'pip install -r requirements.txt'
                            } else if (fileExists('Gemfile')) {
								sh 'bundle install'
                            }
                        }
                    }
                }

                stage('Build Application') {
					steps {
						script {
							if (fileExists('package.json')) {
								sh 'npm run build'
                            } else if (fileExists('Dockerfile')) {
								sh 'echo "Using Docker build process"'
                            }
                        }
                    }
                }
            }
        }

        /*stage('Test') {
			steps {
				script {
					if (fileExists('package.json')) {
						sh 'npm test'
                    } else if (fileExists('pytest.ini') || fileExists('test_*.py')) {
						sh 'python -m pytest'
                    }
                }
            }
            post {
				always {
					script {
						if (fileExists('coverage.xml')) {
							publishCoverage adapters: [coberturaAdapter('coverage.xml')], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                        }
                    }
                }
            }
        }*/

        stage('Build Docker Image') {
			steps {
				script {
					// Build Docker image with staging-specific configurations
                    sh """
                        docker build \
                            --build-arg NODE_ENV=${NODE_ENV} \
                            --build-arg BUILD_VERSION=${IMAGE_TAG} \
                            --build-arg DEBUG_MODE=${DEBUG_MODE} \
                            -t ${PROJECT_NAME}:${IMAGE_TAG} .
                        docker tag ${PROJECT_NAME}:${IMAGE_TAG} ${PROJECT_NAME}:latest

                        # Tag for Docker Hub
                        docker tag ${PROJECT_NAME}:${IMAGE_TAG} ${DOCKER_USERNAME}/${PROJECT_NAME}:${IMAGE_TAG}
                        docker tag ${PROJECT_NAME}:${IMAGE_TAG} ${DOCKER_USERNAME}/${PROJECT_NAME}:latest
                    """

                    // Push to Docker Hub
                    sh """
                        echo "Logging into Docker Hub..."
                        echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin

                        echo "Pushing images to Docker Hub..."
                        docker push ${DOCKER_USERNAME}/${PROJECT_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_USERNAME}/${PROJECT_NAME}:latest

                        echo "Docker Hub push completed!"
                    """
                }
            }
        }

        stage('Deploy to Lightsail') {
			steps {
				script {
					// Get Lightsail instance IP
                    def instanceIP = sh(
                        script: """
                            aws lightsail get-instance --instance-name ${LIGHTSAIL_INSTANCE_NAME} \
                                --region ${AWS_REGION} \
                                --query 'instance.publicIpAddress' \
                                --output text
                        """,
                        returnStdout: true
                    ).trim()

                    echo "Deploying to Lightsail instance: ${instanceIP}"

                    // Create deployment package
                    sh """
                        # Create deployment directory
                        mkdir -p deployment

                        # Copy necessary files
                        cp docker-compose.yml deployment/ || echo "docker-compose.yml not found, creating default"
                        cp -r . deployment/app/ || true

                        # Create docker-compose.yml if it doesn't exist
                        if [ ! -f deployment/docker-compose.yml ]; then
                            cat > deployment/docker-compose.yml << EOF
version: '3.8'
services:
  app:
    image: ${DOCKER_USERNAME}/${PROJECT_NAME}:staging-latest
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port for staging
    environment:
      - NODE_ENV=${NODE_ENV}
      - PORT=${PORT}
      - DEBUG_MODE=${DEBUG_MODE}
      - LOG_LEVEL=${LOG_LEVEL}
      - ENABLE_PROFILING=${ENABLE_PROFILING}
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env  # All credentials and config loaded from Secrets Manager
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
    volumes:
      - ./logs:/app/logs
EOF
                        fi

                        # Create deployment script
                        cat > deployment/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting deployment..."

# Stop existing containers
docker-compose down || true

# Pull latest images
docker-compose pull || true

# Start services
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Health check
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "Deployment successful!"
else
    echo "Health check failed, checking logs..."
    docker-compose logs
    exit 1
fi
EOF
                        chmod +x deployment/deploy.sh
                    """

                    // Deploy to Lightsail instance
                    sh """
                        # Get SSH key for Lightsail instance
                        aws lightsail download-default-key-pair --region ${AWS_REGION} --output text --query 'privateKeyBase64' | base64 -d > lightsail-key.pem
                        chmod 600 lightsail-key.pem

                        # Copy deployment files to instance
                        scp -i lightsail-key.pem -o StrictHostKeyChecking=no -r deployment/ ubuntu@${instanceIP}:/opt/${PROJECT_NAME}/

                        # Pull Docker image from Docker Hub on the instance
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} "
                            echo 'Logging into Docker Hub on instance...'
                            echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin

                            echo 'Pulling latest image from Docker Hub...'
                            docker pull ${DOCKER_USERNAME}/${PROJECT_NAME}:staging-latest
                        "

                        # Execute deployment on instance
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} '
                            cd /opt/${PROJECT_NAME}/deployment
                            ./deploy.sh
                        '
                    """
                }
            }
        }

        stage('Staging Integration Tests') {
			steps {
				script {
					// Get load balancer DNS or instance IP
                    def healthCheckUrl = sh(
                        script: """
                            # Try to get load balancer DNS first
                            LB_DNS=\$(aws lightsail get-load-balancer --load-balancer-name ${PROJECT_NAME}-${ENVIRONMENT}-lb --region ${AWS_REGION} --query 'loadBalancer.dnsName' --output text 2>/dev/null || echo "")

                            if [ -n "\$LB_DNS" ] && [ "\$LB_DNS" != "None" ]; then
                                echo "https://\$LB_DNS"
                            else
                                INSTANCE_IP=\$(aws lightsail get-instance --instance-name ${LIGHTSAIL_INSTANCE_NAME} --region ${AWS_REGION} --query 'instance.publicIpAddress' --output text)
                                echo "http://\$INSTANCE_IP"
                            fi
                        """,
                        returnStdout: true
                    ).trim()

                    // Run staging-specific tests
                    sh """
                        echo "Running staging integration tests on: ${healthCheckUrl}"

                        # Wait for application to be ready
                        sleep 60

                        # Test health endpoint
                        curl -f -s "${healthCheckUrl}/health"

                        # Test debug endpoints (staging only)
                        curl -f -s "${healthCheckUrl}/debug/info" || echo "Debug endpoint not available"

                        # Run performance tests (lighter load for staging)
                        if command -v ab &> /dev/null; then
                            ab -n 100 -c 5 "${healthCheckUrl}/" || echo "Apache bench not available"
                        fi

                        # Test error handling
                        curl -f -s "${healthCheckUrl}/test/error" || echo "Error test endpoint not available"
                    """
                }
            }
        }
    }

    post {
		always {
			script {
				// Clean up
                sh '''
                    docker image prune -f || true
                    rm -f lightsail-key.pem || true
                    rm -rf deployment/ || true
                '''
            }
        }

        success {
			echo 'Staging deployment successful!'
            script {
				// Notify team about successful staging deployment
                def instanceIP = sh(
                    script: """
                        aws lightsail get-instance --instance-name ${LIGHTSAIL_INSTANCE_NAME} \
                            --region ${AWS_REGION} \
                            --query 'instance.publicIpAddress' \
                            --output text
                    """,
                    returnStdout: true
                ).trim()

                echo """
                🎉 Staging Deployment Complete!
                📱 Application: ${PROJECT_NAME}
                🌐 Environment: ${ENVIRONMENT}
                🔗 URL: http://${instanceIP}:3000
                📦 Version: ${IMAGE_TAG}
                🔧 Debug Mode: Enabled
                """
            }
            // Add notification logic here (Slack, email, etc.)
        }

        failure {
			echo 'Staging deployment failed!'
            // Add failure notification logic here
            script {
				// Get instance logs for debugging
                try {
					def instanceIP = sh(
                        script: """
                            aws lightsail get-instance --instance-name ${LIGHTSAIL_INSTANCE_NAME} \
                                --region ${AWS_REGION} \
                                --query 'instance.publicIpAddress' \
                                --output text
                        """,
                        returnStdout: true
                    ).trim()

                    sh """
                        aws lightsail download-default-key-pair --region ${AWS_REGION} --output text --query 'privateKeyBase64' | base64 -d > lightsail-key.pem
                        chmod 600 lightsail-key.pem

                        echo "=== Staging Application Logs ==="
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} 'cd /opt/${PROJECT_NAME} && docker-compose logs --tail=100' || true

                        echo "=== Container Status ==="
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} 'docker ps -a' || true

                        echo "=== System Resources ==="
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} 'df -h && free -m' || true

                        echo "=== Recent System Logs ==="
                        ssh -i lightsail-key.pem -o StrictHostKeyChecking=no ubuntu@${instanceIP} 'tail -100 /var/log/syslog' || true
                    """
                } catch (Exception e) {
					echo "Failed to retrieve staging logs: ${e.message}"
                }
            }
        }
    }
}