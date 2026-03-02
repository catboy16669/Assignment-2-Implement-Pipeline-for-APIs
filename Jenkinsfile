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
    }

    stages {

        stage('Checkout') {
            steps {
                echo "🔄 Checking out code..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Code Quality Check') {
            steps {
                echo "✅ Running code quality checks..."
                sh '''
                    echo "Checking package.json validity..."
                    npm list
                '''
            }
        }

        stage('Build') {
            steps {
                echo "🔨 Building application..."
                sh '''
                    echo "Application is ready for deployment"
                    npm run --list
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh '''
                    echo "Test stage - add your test scripts to package.json"
                '''
            }
        }

        stage('Security Scan') {
            steps {
                echo "🔒 Running security audit..."
                sh 'npm audit --audit-level=moderate || true'
            }
        }

        stage('Archive Artifacts') {
            steps {
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

        stage('Deploy') {
            steps {
                echo "🚀 Deploying application..."
                sh '''
                    pm2 restart ${APP_NAME} || pm2 start index.js --name ${APP_NAME}
                    pm2 save
                '''
            }
        }
    }

    post {

        always {
            echo "🧹 Pipeline cleanup..."
        }

        success {
            echo "✅ Pipeline completed successfully!"
        }

        failure {
            echo "❌ Pipeline failed!"
        }
    }
}