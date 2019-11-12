Feature: Compilation error
    Scenario:
        Given a webpack configuration that yields an error
        And I run webpack in watch mode
        Then the output should include "[nodemon-webpack-plugin]: Compilation error."
