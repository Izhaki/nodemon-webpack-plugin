Feature: Zero configuration
    Background:
        Given I run webpack in watch mode
        And the server has started

    Scenario: The entry file is modified
        When the entry file is modified
        Then the output should include "[nodemon] restarting due to changes..."
        And the server should restart

    Scenario: A file not related to the entry file is modified
        When a file unrelated to the entry file is modified
        Then the server shouldn't restart
