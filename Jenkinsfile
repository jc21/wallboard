pipeline {
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
  }
  agent any
  environment {
      S3_BUCKET = "jc21-dashboard"
  }
  stages {
    stage('Build') {
      steps {
        ansiColor('xterm') {
          sh 'docker run --rm -v $(pwd):/app -w /app jc21/node yarn install'
          sh 'docker run --rm -v $(pwd):/app -w /app jc21/node npm run-script build'
        }
      }
    }
    stage('Deploy') {
      when {
        branch 'master'
      }
      steps {
        ansiColor('xterm') {
          withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws-jc21-s3', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {

            sh '''
            cd dist

            for DIR in *
            do
              PARAM_STRING="--guess-mime-type"
                if [ "$DIR" == "css" ]; then
                  PARAM_STRING="-m text/css"
                elif [ "$DIR" == "js" ]; then
                  PARAM_STRING="-m application/javascript"
                elif [[ "$DIR" == *html ]]; then
                  PARAM_STRING="-m text/html"
                elif [[ "$DIR" == *json ]]; then
                  PARAM_STRING="-m application/json"
                fi

                docker run --rm -v $(pwd):/app -w /app jc21/ci-tools s3cmd --access_key=${AWS_ACCESS_KEY_ID} --secret_key=${AWS_SECRET_ACCESS_KEY} -v -f -P $PARAM_STRING sync "$DIR" "s3://$S3_BUCKET/"

                # exit if bad return code
                rc=$?; if [ $rc != 0 ]; then exit $rc; fi
            done
            '''

            sh 'docker run --rm -v $(pwd)/dist:/app -w /app jc21/ci-tools s3cmd --access_key=${AWS_ACCESS_KEY_ID} --secret_key=${AWS_SECRET_ACCESS_KEY} -v -f -P -m text/html sync "index.html" "s3://${S3_BUCKET}/"'
            sh 'docker run --rm -v $(pwd)/dist:/app -w /app jc21/ci-tools s3cmd --access_key=${AWS_ACCESS_KEY_ID} --secret_key=${AWS_SECRET_ACCESS_KEY} -v -f -P -m application/json sync "version.json" "s3://${S3_BUCKET}/"'
          }
        }
      }
    }
  }
  post {
    success {
      juxtapose event: 'success'
      sh 'figlet "SUCCESS"'
    }
    failure {
      juxtapose event: 'failure'
      sh 'figlet "FAILURE"'
    }
  }
}
