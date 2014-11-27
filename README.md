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

	```npm -g install js-beautify```

2. go to web directory
	
	```cd /Applications/TweetDeck.app/Contents/Resources/htdocs/web```

3. pretty print templates and main js

	```cd scripts/swift/app/```
	
	```sudo chmod 777 main.*```
	
	```js-beautify -r main.*```

	```cd ../../../mustaches/```

	```sudo sed -i.bu 's/this\.TD_mustaches/\
this\.TD_mustaches/g' mustaches.*```

4. add isClearable and hasHeaderActions to templates / js
    ```
this.TD_mustaches["column/column_header.mustache"]=
'<header class="js-column-header js-action-header {{^isTemporary}}column-header{{/isTemporary}} {{#isTemporary}}column-header-temp{{/isTemporary}}" data-action="resetToTopColumn">' +
'   {{^isTemporary}} <i class="js-column-drag-handle is-movable column-drag-handle pull-left sprite sprite-drag-vertical"></i> {{/isTemporary}}  ' +
'   <i class="pull-left margin-hs column-type-icon icon {{columniconclass}}"></i>  ' +
'   {{#isTemporary}} <button class="js-action-header-button pull-right btn list-edit-button is-hidden" data-action="editList"></button> {{/isTemporary}}  ' +
'   {{^isTemporary}} <span class="column-number"></span> {{/isTemporary}}  ' +
'   {{^withEditableTitle}} <h1 class="column-title {{#hasHeaderAction}}column-title-messages{{/hasHeaderAction}} txt-ellipsis">{{{columntitle}}}</h1> {{/withEditableTitle}} ' +
'   {{#withEditableTitle}} <div class="column-title txt-ellipsis column-title-editable with-image-attribution {{#hasHeaderAction}}column-title-messages{{/hasHeaderAction}} "> {{{columntitle}}} </div> {{/withEditableTitle}}  ' +
'   {{#withDMComposeButton}} <a class="js-action-header-button column-header-link open-compose-dm-link" href="#" data-action="compose-dm"> <i class="js-show-tip icon icon-compose-dm" data-placement="bottom" title="{{_i}}Compose new message{{/i}}"></i> </a> {{/withDMComposeButton}}  ' +
'   {{#withMarkAllRead}} <a class="js-action-header-button column-header-link mark-all-read-link" href="#" data-action="mark-all-read"> <i class="js-show-tip icon icon-mark-read" data-placement="bottom" title="{{_i}}Mark all as read{{/i}}"></i> </a> {{/withMarkAllRead}}  ' +
'   {{#isClearable}} <a class="js-action-header-button column-header-link mark-all-read-link" href="#" data-action="clear"> <i class="js-show-tip icon icon-mark-read" data-placement="bottom" title="{{_i}}Clear Tweets{{/i}}"></i> </a> {{/isClearable}}  ' +
'   {{^isTemporary}} <a class="js-action-header-button column-header-link column-settings-link" href="#" data-action="options"> <i class="icon icon-sliders"></i> </a> {{/isTemporary}} ' +
'</header>',
    ```


5. Add javascript to main file.
    Search Keys
        handleMarkAllRead
            add these lines to the action function variables
                ```
        }, this.handleColumnClear = function() {
            this.column.clear(), this.trigger("uiClearColumnAction", {
                columnId: this.column.model.getKey()
            });
                ```
            add these lines to the event registration protion
                ```, this.on("uiColumnClearAction", this.handleColumnClear), 
                ```

        mark-all-read
            add these lines to the action switch
                ```
                    case "clear":
                        s.trigger("uiColumnClearAction", {
                            columnKey: n
                        });
                        break;
                ```

        column/column_header
            add these lines to the template variables object
                ```
                        hasHeaderAction: hA,
                        isClearable: iC,
                ```

            add these lines to the end of the javascript right before the template variable object. 
            you have to find out the column parameter is `mCol = ?`. 
            look for `isMessageColumn()` method call  a line up and find the object.
                ```
                        var mCol = ?,
                        cMes = mCol.isMessageColumn(), 
                        iC = !cMes && mCol.isClearable(),
                        hA = cMes || iC;
                ```
