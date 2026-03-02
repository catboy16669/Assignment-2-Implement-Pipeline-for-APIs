pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        NODE_ENV = 'production'
        APP_NAME = 'assignment2-devops-api'
        REGISTRY = 'docker.io'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code..."
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing npm dependencies..."
                    sh 'npm install'
                }
            }
        }

        stage('Code Quality Check') {
            steps {
                script {
                    echo "✅ Running code quality checks..."
                    sh '''
                        # Basic linting - you can add ESLint if needed
                        echo "Checking package.json validity..."
                        npm list
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "🔨 Building application..."
                    sh '''
                        echo "Application is ready for deployment"
                        npm run --list
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "🧪 Running tests..."
                    sh '''
                        # Add your test command here
                        # Example: npm test
                        echo "Test stage - add your test scripts to package.json"
                    '''
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    echo "🔒 Running security audit..."
                    sh 'npm audit --audit-level=moderate || true'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                script {
                    echo "📦 Archiving artifacts..."
                    sh '''
                        mkdir -p build-artifacts
                        cp package.json build-artifacts/
                        cp package-lock.json build-artifacts/ || true
                        cp index.js build-artifacts/
                    '''
                    archiveArtifacts artifacts: 'build-artifacts/**', fingerprint: true
                }
            }
        }

        stage('Deploy Preparation') {
            steps {
                script {
                    echo "🚀 Preparing for deployment..."
                    sh '''
                        echo "API URL: http://localhost:3000"
                        echo "Application: ${APP_NAME}"
                        echo "Environment: ${NODE_ENV}"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                cleanWs(deleteDirs: true, patterns: [[pattern: 'node_modules/', type: 'INCLUDE']])
            }
        }

        success {
            script {
                echo "✅ Pipeline completed successfully!"
                // You can add notifications here (email, Slack, etc.)
            }
        }

        failure {
            script {
                echo "❌ Pipeline failed!"
                // You can add failure notifications here
            }
        }
    }
}
