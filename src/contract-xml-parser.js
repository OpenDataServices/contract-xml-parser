


class ContractXMLParser {
    constructor(data) {
        this.data = data;

        this.out_title = "";
        this.out_subtitle = "";
        this.out_body = "";

        var oParser = new DOMParser();
        var oDOM = oParser.parseFromString(data, "application/xml");

        this.marker_stack =  [
            {
                'type': 'number',
                'next': 1
            }
        ];

        for (var i = 0; i < oDOM.firstChild.childNodes.length; i++) {
          var node = oDOM.firstChild.childNodes[i];
          if(node.nodeType !== Node.TEXT_NODE) {
            if(node.localName == 'title') {
                this._process_title(node);
            } else if (node.localName == 'subtitle') {
                this._process_subtitle(node);
            } else if (node.localName == 'body') {
                this._process_body(node);
            }
          }
        }





    }

    _process_title(node) {
        this.out_title = '<h1>' + node.textContent.trim() + '</h1>';
    }

    _process_subtitle(node) {
        this.out_subtitle = '<h2>' + node.textContent.trim() + '</h2>';
    }

    _process_body(node) {

        for (var i = 0; i < node.childNodes.length; i++) {
          var childNode = node.childNodes[i];
          if(childNode.nodeType !== Node.TEXT_NODE) {
            this._process_body_node(childNode);
          }
        }

    }

    _process_body_node(node) {
        if (node.localName == 'title') {
            this._process_body_node_title(node);
        } else if(node.localName == 'item') {
            this._process_body_node_item(node);
        } else if(node.localName == 'item-with-children') {
            this._process_body_node_item_with_children(node);
        }
    }

    _process_body_node_title(node) {
        this.out_body += '<h3>' + node.textContent.trim() + '</h3>';
    }


    _process_body_node_item(node) {

        var marker = '';
        if (this.marker_stack[0]['type'] == 'number') {
            marker = this.marker_stack[0]['next'] + '.';
        this.marker_stack[0]['next']++;
        } if (this.marker_stack[0]['type'] == 'loweralpha') {
            marker = '(' + this._marker_number_to_alpha(this.marker_stack[0]['next']) + ')';
        this.marker_stack[0]['next']++;
        } else if (this.marker_stack[0]['type'] == 'disc') {
            marker = 'o.';
        }

        this.out_body += '<div class="nested'+this.marker_stack.length+'">' + marker + ' ' + node.textContent.trim() + '</div>';

    }


    _process_body_node_item_with_no_marker(node) {


        this.out_body += '<div class="nested'+this.marker_stack.length+'">' + node.textContent.trim() + '</div>';

    }

    _process_body_node_item_with_children(node) {

        var addedToMarkerStack = false;
        var firstItemFound = false;

        for (var i = 0; i < node.childNodes.length; i++) {
          var childNode = node.childNodes[i];
          if(childNode.nodeType !== Node.TEXT_NODE) {

            if(childNode.localName == 'item') {

                if (firstItemFound) {
                    this._process_body_node_item_with_no_marker(childNode);
                } else {
                    this._process_body_node_item(childNode);
                    firstItemFound = true;
                }

            } else if(childNode.localName == 'child-item') {

                if (!addedToMarkerStack) {
                    addedToMarkerStack = true;
                    if (node.getAttribute('marker-type') == 'disc') {
                        this.marker_stack.unshift({
                            'type': 'disc',
                        })
                    } else if (node.getAttribute('marker-type') == 'loweralpha') {
                        this.marker_stack.unshift({
                            'type': 'loweralpha',
                            'next': 1,
                        })
                    } else {
                        this.marker_stack.unshift({
                            'type': 'number',
                            'next': 1,
                        })
                    }
                }

                for (var j = 0; j < childNode.childNodes.length; j++) {
                  var childNodeWithinList = childNode.childNodes[j];
                  if(childNodeWithinList.nodeType !== Node.TEXT_NODE) {
                    if (childNodeWithinList.localName == 'item') {
                        this._process_body_node_item(childNodeWithinList);
                    } else if (childNodeWithinList.localName == 'item-with-children') {
                        this._process_body_node_item_with_children(childNodeWithinList);
                    }
                  }
                }


            }

          }
        }

        if (addedToMarkerStack) {
            this.marker_stack.shift();
        }



    }

    get() {

        return this.out_title + this.out_subtitle + this.out_body;


    }


    _marker_number_to_alpha(number) {
        return String.fromCharCode(number + 96);
    }
}



