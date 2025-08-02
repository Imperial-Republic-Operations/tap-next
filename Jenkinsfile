pipeline {
    agent any

    tools {
        nodejs "Node 22"
    }

    environment {
        // AWS Configuration
        AWS_REGION = 'us-east-1'
        PROJECT_NAME = 'tap-next'
        
        // Environment determined by branch
        // ENVIRONMENT = "${env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' ? 'production' : 'stage'}"
        ENVIRONMENT = 'stage'
        
        // AWS credentials - configure these in Jenkins credentials
        AWS_CREDENTIALS = credentials('aws-credentials')
        
        // Application version
        APP_VERSION = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                script {
                    // Get git commit info
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.IMAGE_TAG = "${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                    
                    // Set environment-specific variables
                    env.ECR_REPOSITORY = "${PROJECT_NAME}-${ENVIRONMENT}-app"
                    env.ECS_CLUSTER = "${PROJECT_NAME}-${ENVIRONMENT}-cluster"
                    env.ECS_SERVICE = "${PROJECT_NAME}-${ENVIRONMENT}-service"
                    
                    echo "🚀 Deploying ${PROJECT_NAME} to ${ENVIRONMENT}"
                    echo "📦 Image tag: ${IMAGE_TAG}"
                    echo "🏗️ ECR Repository: ${ECR_REPOSITORY}"
                }
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    // Configure AWS credentials
                    sh '''
                        aws configure set aws_access_key_id ${AWS_CREDENTIALS_USR}
                        aws configure set aws_secret_access_key ${AWS_CREDENTIALS_PSW}
                        aws configure set region ${AWS_REGION}
                        aws configure set output json
                    '''
                    
                    // Get ECR repository URI
                    env.ECR_URI = sh(
                        script: """
                            aws ecr describe-repositories \
                                --repository-names ${ECR_REPOSITORY} \
                                --region ${AWS_REGION} \
                                --query 'repositories[0].repositoryUri' \
                                --output text
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "🐳 ECR URI: ${ECR_URI}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "📦 Installing dependencies..."
                    # Use npm install for flexibility in case lock file is out of sync
                    npm install --no-audit
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    echo "🧪 Running tests..."
                    npm run test
                '''

                // Publish test results if available
                script {
                    if (fileExists('coverage/lcov.info')) {
                        publishCoverage adapters: [lcovAdapter('coverage/lcov.info')],
                        sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                    }
                }
            }
        }

        /*stage('Lint & Type Check') {
            steps {
                sh '''
                    echo "🔍 Running linter..."
                    npm run lint
                '''
            }
        }*/

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // Login to ECR
                    sh '''
                        echo "🔐 Logging into ECR..."
                        aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_URI}
                    '''
                    
                    // Build Docker image
                    sh """
                        echo "🏗️ Building Docker image..."
                        docker build \
                            --build-arg NODE_ENV=${ENVIRONMENT == 'production' ? 'production' : 'staging'} \
                            --build-arg BUILD_VERSION=${IMAGE_TAG} \
                            -t ${ECR_REPOSITORY}:${IMAGE_TAG} \
                            -t ${ECR_REPOSITORY}:latest \
                            .
                        
                        # Tag for ECR
                        docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
                        docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest
                    """
                    
                    // Push to ECR
                    sh """
                        echo "📤 Pushing images to ECR..."
                        docker push ${ECR_URI}:${IMAGE_TAG}
                        docker push ${ECR_URI}:latest
                        echo "✅ ECR push completed!"
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                script {
                    echo "🚀 Deploying to ECS cluster: ${ECS_CLUSTER}"
                    
                    // Update ECS service with new image
                    sh """
                        echo "🔄 Updating ECS service..."
                        
                        # Get current task definition
                        TASK_DEFINITION_ARN=\$(aws ecs describe-services \
                            --cluster ${ECS_CLUSTER} \
                            --services ${ECS_SERVICE} \
                            --query 'services[0].taskDefinition' \
                            --output text)
                        
                        echo "📋 Current task definition: \$TASK_DEFINITION_ARN"
                        
                        # Get task definition JSON and update image
                        aws ecs describe-task-definition \
                            --task-definition \$TASK_DEFINITION_ARN \
                            --query 'taskDefinition' > current-task-def.json
                        
                        # Update the image in the task definition
                        cat current-task-def.json | jq '
                            .containerDefinitions[0].image = "${ECR_URI}:${IMAGE_TAG}" |
                            del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities, .registeredAt, .registeredBy)
                        ' > new-task-def.json
                        
                        # Register new task definition
                        NEW_TASK_DEF_ARN=\$(aws ecs register-task-definition \
                            --cli-input-json file://new-task-def.json \
                            --query 'taskDefinition.taskDefinitionArn' \
                            --output text)
                        
                        echo "📋 New task definition: \$NEW_TASK_DEF_ARN"
                        
                        # Update service to use new task definition
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER} \
                            --service ${ECS_SERVICE} \
                            --task-definition \$NEW_TASK_DEF_ARN \
                            --force-new-deployment
                        
                        echo "✅ ECS service update initiated"
                    """
                }
            }
        }

        stage('Wait for Deployment') {
            steps {
                script {
                    echo "⏳ Waiting for deployment to complete..."
                    
                    sh """
                        echo "🔍 Monitoring deployment status..."
                        
                        # Wait for service to stabilize (up to 15 minutes)
                        aws ecs wait services-stable \
                            --cluster ${ECS_CLUSTER} \
                            --services ${ECS_SERVICE} \
                            --cli-read-timeout 900 \
                            --cli-connect-timeout 60
                        
                        echo "✅ Deployment completed successfully!"
                    """
                }
            }
        }

        /*stage('Health Check & Integration Tests') {
            steps {
                script {
                    // Get application URL
                    def appUrl = sh(
                        script: """
                            if [ "${ENVIRONMENT}" = "stage" ]; then
                                # Try to get Route53 record first for stage
                                DOMAIN_NAME=\$(aws route53 list-resource-record-sets \
                                    --hosted-zone-id \$(aws route53 list-hosted-zones \
                                        --query "HostedZones[?Name=='keshaun.net.'].Id" \
                                        --output text | cut -d'/' -f3) \
                                    --query "ResourceRecordSets[?Name=='tap.keshaun.net.'].Name" \
                                    --output text 2>/dev/null || echo "")
                                
                                if [ -n "\$DOMAIN_NAME" ]; then
                                    echo "https://tap.keshaun.net"
                                else
                                    # Fallback to ALB DNS
                                    ALB_DNS=\$(aws elbv2 describe-load-balancers \
                                        --names ${PROJECT_NAME}-${ENVIRONMENT}-alb \
                                        --query 'LoadBalancers[0].DNSName' \
                                        --output text)
                                    echo "https://\$ALB_DNS"
                                fi
                            else
                                # Production uses ALB DNS
                                ALB_DNS=\$(aws elbv2 describe-load-balancers \
                                    --names ${PROJECT_NAME}-${ENVIRONMENT}-alb \
                                    --query 'LoadBalancers[0].DNSName' \
                                    --output text)
                                echo "https://\$ALB_DNS"
                            fi
                        """,
                        returnStdout: true
                    ).trim()

                    echo "🌐 Application URL: ${appUrl}"

                    // Health check
                    sh """
                        echo "🏥 Running health checks..."
                        
                        # Wait for application to be ready
                        sleep 60
                        
                        # Test health endpoint
                        for i in {1..10}; do
                            if curl -f -s "${appUrl}/api/health"; then
                                echo "✅ Health check passed"
                                break
                            else
                                echo "⏳ Health check attempt \$i failed, retrying in 30s..."
                                sleep 30
                            fi
                        done
                        
                        # Test main page
                        curl -f -s "${appUrl}/" > /dev/null || {
                            echo "❌ Main page check failed"
                            exit 1
                        }
                        
                        echo "✅ All health checks passed"
                    """

                    env.APP_URL = appUrl
                }
            }
        }*/
    }

    post {
        always {
            script {
                // Clean up
                sh '''
                    docker image prune -f || true
                    rm -f current-task-def.json new-task-def.json || true
                '''
            }
        }

        success {
            script {
                echo """
                🎉 ${ENVIRONMENT.toUpperCase()} Deployment Successful!
                
                📱 Application: ${PROJECT_NAME}
                🌍 Environment: ${ENVIRONMENT}
                🔗 URL: ${APP_URL}
                📦 Version: ${IMAGE_TAG}
                🏗️ ECS Cluster: ${ECS_CLUSTER}
                🔄 ECS Service: ${ECS_SERVICE}
                🐳 ECR Image: ${ECR_URI}:${IMAGE_TAG}
                """
                
                // Add notification logic here (Slack, email, etc.)
            }
        }

        failure {
            script {
                echo "❌ ${ENVIRONMENT} deployment failed!"
                
                // Get ECS service events for debugging
                try {
                    sh """
                        echo "=== ECS Service Events ==="
                        aws ecs describe-services \
                            --cluster ${ECS_CLUSTER} \
                            --services ${ECS_SERVICE} \
                            --query 'services[0].events[:10]' \
                            --output table || true
                        
                        echo "=== ECS Task Status ==="
                        aws ecs list-tasks \
                            --cluster ${ECS_CLUSTER} \
                            --service-name ${ECS_SERVICE} \
                            --query 'taskArns[:5]' \
                            --output text | xargs -I {} aws ecs describe-tasks \
                            --cluster ${ECS_CLUSTER} \
                            --tasks {} \
                            --query 'tasks[0].{TaskArn:taskArn,LastStatus:lastStatus,HealthStatus:healthStatus,StoppedReason:stoppedReason}' \
                            --output table || true
                        
                        echo "=== Recent CloudWatch Logs ==="
                        aws logs tail /ecs/${PROJECT_NAME}-${ENVIRONMENT} \
                            --since 10m \
                            --format short || true
                    """
                } catch (Exception e) {
                    echo "Failed to retrieve deployment logs: ${e.message}"
                }
                
                // Add failure notification logic here
            }
        }
    }
}