tweetdeck-clear-column
======================

Clear Column for tweetdeck mac


replace these two files in the htdocs/web

* mustaches/mustaches.*.js
* scripts/swift/app/main.*.js

And the clear column action will appear in the title bar.

It doesn't override the 'mark all as read' action on messages, so on that column you will still need to open the column.

Otherwise, it uses the 'mark all as read' icon for the clear action.

wbyoko

### How to

1. install js-beautify globaly

	npm -g install js-beautify

2. go to web directory
	
	cd /Applications/TweetDeck.app/Contents/Resources/htdocs/web

3. pretty print templates and main js

	cd scripts/swift/app/
	sudo chmod 777 main.*
	js-beautify -r main.*

	cd ../../../mustaches/

	sudo sed -i.bu 's/this\.TD_mustaches/\
this\.TD_mustaches/g' mustaches.*

4. add isClearable and hasHeaderActions to templates / js
