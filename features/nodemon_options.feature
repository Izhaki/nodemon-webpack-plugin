Feature: Support nodemon options

    Scenario: nodemon is asked to watch the whole output directory
        Given the following nodemon config:
            """
            {
                watch: outputDir,
            }
            """
        And I run webpack in watch mode
        And the server has started
        When a file unrelated to the entry file is modified
        Then the output should include "[nodemon] restarting due to changes..."
        And the server should restart

    Scenario: pass arguments to the output script
        Given the following nodemon config:
            """
            {
                args: [ '--port', '4096' ],
            }
            """
        And I run webpack in watch mode
        Then the server should start with the arguments "[ '--port', '4096' ]"
