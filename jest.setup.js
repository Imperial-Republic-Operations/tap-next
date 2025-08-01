import '@testing-library/jest-dom'

// Mock NextRequest and NextResponse specifically
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    constructor(url, options = {}) {
      this._url = url
      this.method = options.method || 'GET'
      this.headers = new Map(Object.entries(options.headers || {}))
      this._body = options.body
      this.nextUrl = new URL(url)
    }
    
    get url() {
      return this._url
    }
    
    async json() {
      return JSON.parse(this._body || '{}')
    }
  },
  NextResponse: class MockNextResponse {
    constructor(body, options = {}) {
      this.body = body
      this.status = options.status || 200
      this.headers = new Map(Object.entries(options.headers || {}))
    }
    
    async json() {
      return JSON.parse(this.body)
    }
    
    static json(data, options = {}) {
      return new MockNextResponse(JSON.stringify(data), {
        status: options.status || 200,
        headers: { 'Content-Type': 'application/json', ...options.headers }
      })
    }
  },
}))

// Fallback for regular Request/Response
global.Request = class MockRequest {
  constructor(url, options = {}) {
    this._url = url
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this._body = options.body
  }
  
  get url() {
    return this._url
  }
  
  async json() {
    return JSON.parse(this._body || '{}')
  }
}

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.headers = new Map(Object.entries(options.headers || {}))
  }
  
  async json() {
    return JSON.parse(this.body)
  }
}

// Basic polyfills
const { TextEncoder, TextDecoder } = require('util')
Object.assign(global, { TextEncoder, TextDecoder })

// Mock next-auth specific components
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'loading' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Mock @auth/prisma-adapter
jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(() => ({})),
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  default: jest.fn(() => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: jest.fn(),
  })),
}))

// Mock the auth.ts file directly
jest.mock('@/auth', () => ({
  handlers: { GET: jest.fn(), POST: jest.fn() },
  signIn: jest.fn(),
  signOut: jest.fn(),
  auth: jest.fn(() => Promise.resolve({ user: null, session: null })),
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    character: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    // Add more models as needed
  },
}))

// Mock BigInt serialization (from middleware)
BigInt.prototype.toJSON = function () {
  return this.toString()
}