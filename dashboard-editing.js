        selectedcell = '';
        
        function tableSelectHandler(table) {
            $("#truefalse").hide();
            var selection = table.getSelection();
            if (selection.length === 0)
              return;

            var cell = event.target;
            if (cell.cellIndex !== 1) {
                
              if (cols[cell.cellIndex].type == 'boolean') {
                selectedcell = cell;
                $('#truefalse').css('height', cell.offsetHeight+'px');
                $('#truefalse').css('width', cell.offsetWidth+'px');
                bodyRect = document.body.getBoundingClientRect();
                elemRect = cell.getBoundingClientRect();
                $('#truefalse').css('top', elemRect.top - bodyRect.top + 8 + 'px');
                $('#truefalse').css('left', elemRect.left - bodyRect.left + 8 + 'px');
                $('#truefalse').show();
                cell.addEventListener('change', cellEdited);
              } else {
                selectedcell = '';
                cell.contentEditable = true;
                cell.addEventListener('blur', cellEdited);
                cell.addEventListener('keypress', cellEdited);
              }
            }
            table.setSelection([]);
        }
        
        function cellEdited(sender) {
            if ((typeof(sender.key)=='undefined') || (sender.key=='Enter')) { 
            sender.target.contentEditable = false;
            sender.target.removeEventListener('blur', cellEdited);
            var nodes = Array.prototype.slice.call(sender.target.parentNode.children);
            var node = sender.target;
            var colIndex = nodes.indexOf(node);
            var rowIndex = sender.target.parentNode.children[1].innerHTML;
                
            var curValue = '';
            var jsonIndex = '';
            for (i=0; i<rows.length;i++) {
                if (rows[i].c[1].v==rowIndex) { 
                    curValue = rows[i].c[colIndex].v;
                    jsonIndex = i;
                }
            }

            var testval = '';

            if ($(node).html()!='') {
                switch (cols[colIndex].type) {
                    case 'number':
                        testval = $(node).html().replace(/[^0-9\.]/g,'');
                        $(node).html(testval.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));         
                        break;
                    case 'boolean':
                        testval = $(node).html().trim().toLowerCase();
                        if (testval==='✗' || testval==='false' || testval==='f' || testval==='0' || testval==='no') {
                            testval = false;
                            $(node).html('✗');
                        } else {
                            testval = true;
                            $(node).html('✔');
                        }
                        break;
                    default:
                        testval = $(node).html();
                }
            }

            if (curValue != testval) {
                console.log('UPDATED ID '+rowIndex+', COL '+cols[colIndex].id+': '+curValue+' '+testval);
                //API call here
                dt.setCell(jsonIndex, colIndex, testval);
                console.log(rows);
            }
            
        }}
        
        function setBoolCell(inval) {
            $("#truefalse").hide();
            
            if (inval) {
                selectedcell.innerHTML = 'true';
            } else {
                selectedcell.innerHTML = 'false';
            }

            var event = new UIEvent("change", {
                "view": window,
                "bubbles": true,
                "cancelable": true
            });
            selectedcell.dispatchEvent(event);

            return false;
        }