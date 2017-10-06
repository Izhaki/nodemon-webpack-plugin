Feature: Support substitutions in output filename

    Scenario: output filename includes substitutions
        Given the output filename is "[name]-[hash].js"
        And I run webpack in watch mode
        Then the server should start
