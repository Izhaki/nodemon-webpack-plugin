Feature: Clean exit
    Scenario: Ctrl-C is pressed
        Given I run webpack in watch mode
        And the server has started
        And Ctrl-c has been pressed
        When the entry file is modified
        Then the server shouldn't restart
