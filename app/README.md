# Netwise

Open source project to tackle the problem of long development cycles required to
produce software to conduct multi-participant and real-time human experiments
online.

## Experiment development

Netwise was built with the experiement developer in mind. The _core_ of Netwise
has been seperated from the _games_.

The folder structure reflects this organization method. There are multiple
examples _games_ you can start work from.

To develop a new game, you will only be interested in a couple of folders:

* imports/games
* public/games

All other folders contain _core_ Netwise code, which you should not need to
change in the vast majority of cases.

Within those 2 _games_ folders, there is a list of subfolders, each representing
an example game (task, prisonner, etc.) You should start by finding the game
type that most ressembles the game you want to build. Then duplicate and rename
the 2 folders you will be using. And change the reference the new name of the
folders in `XXX` (TBD where we configure what the current game is).
