/* 
    Alexander Chen
    Alexander_Chen@student.uml.edu
    Javascript file for Assignment 8
*/

//some of the following code was borrowed from Professor Heines to help with slider initialization
var str = getField( strVarToInitialize ) ;
        if ( str !== null ) {
          var n = parseInt( str, 10 ) ;
          if ( ! isNaN( n ) ) {
            tblGenerator[strVarToInitialize] = n ;
          }
        }
        
        
        $( '#' + strVarToInitialize ).val( tblGenerator[ strVarToInitialize ] ) ;   
        
        
        var strSliderID = "#slider" + strVarToInitialize[0].toUpperCase()+strVarToInitialize.substr(1) ;
        $( strSliderID ).slider( "value", parseInt( str ) ) ;
        
        // bind changes in text fields to sliders
        $( '#' + strVarToInitialize ).blur( function() {
          // console.log( '#' + strVarToInitialize + " lost focus, slider is " + strSliderID ) ;
          $( strSliderID ).slider( "value", parseInt( $( '#' + strVarToInitialize ).val() ) ) ;
        } ) ;
        
        
      } ,

      // get passed parameters
      "initialize" : function() {
        tblInitializer.initializeHelper( "xBegin" ) ;
        tblInitializer.initializeHelper( "xEnd" ) ;
        tblInitializer.initializeHelper( "yBegin" ) ;
        tblInitializer.initializeHelper( "yEnd" ) ;
      }
    } ;

    var tblValidator = {   

      // surround an erroneous error field with a red border
      highlightError : function( strVarToTest ) {
        $( '#' + strVarToTest ).css( { "border" : "2px solid red" } )  ;
        $( '#' + strVarToTest ).focus() ;
      } ,

      // remove the red border around an erroneous error field
      unhighlightError : function( strVarToTest ) {
        $( '#' + strVarToTest ).css( { "border" : "" } )  ;
      } ,

    
      validateFormHelper : function( strVarToTest, strParamDesc ) {
        var str = $( '#' + strVarToTest ).val() ;
        if ( str === null ) {
          tblValidator.highlightError( strVarToTest ) ;
          return strParamDesc + " does not exist." ;
        } else if ( str === "" ) {
          tblValidator.highlightError( strVarToTest ) ;
          return strParamDesc + " was not supplied." ;
        } else if ( isNaN( parseInt( str, 10 ) ) ) {
          tblValidator.highlightError( strVarToTest ) ;
          return strParamDesc + " is not a number." ;
        }
        $( '#' + strVarToTest ).css( { "border" : "" } )  ;
        return "OK" ;
      } ,


    /* This function does the validation */
    $(document).ready(function() {
       //values for the sldiers
       var sliderOpts = {
          min : -10 ,
          max : 10 ,
          // value : 0 ,
          slide : function( e, ui ) {
          // set the input field value to the new slider value
          var strInputID = "#" + e.target.id.substr( 6, 1 ).toLowerCase() + e.target.id.substr( 7 ) ;
          $( strInputID ).val( ui.value ) ;
        }

         /*The greaterThan makes a function that validates that a value is greater than another. The same for lessThan but in reverse 
         greaterThan code found at
         http://stackoverflow.com/questions/14347177/how-can-i-validate-that-the-max-field-is-greater-than-the-min-field
         Adds methods to be used in the rules section of the validate method below.*/
        $.validator.addMethod("greaterThan", /* name of method to be added */
                function(value, element, param) {  /* function definition of method to be added */
                  var $min = $(param);
                  if (this.settings.onfocusout) {
                    $min.off(".validate-greaterThan").on("blur.validate-greaterThan", function() {
                      $(element).valid();
                    });
                  }
                  return parseInt(value) > parseInt($min.val());
                }, "Max must be greater than min"); /*Default error msg */   // end addMethod

        $.validator.addMethod("lessThan",
                function(value, element, param) {
                  var $max = $(param);
                  if (this.settings.onfocusout) {
                    $max.off(".validate-lessThan").on("blur.validate-lessThan", function() {
                      $(element).valid();
                    });
                  }
                  return parseInt(value) < parseInt($max.val());
                }, "Min must be less than max"); // end addMethod

        /*Validate that tests if there is a value, sets a range, and makes sure that the min is less that the max */
        $('#input').validate({
          rules: {
            minCols: {
              required: true,
              range: [-100, 100],
              lessThan: '#maxCols'
            },
            maxCols: {
              required: true,
              range: [-100, 100],
              greaterThan: '#minCols'
            },
            minRows: {
              required: true,
              range: [-100, 100],
              lessThan: '#maxRows'
            },
            maxRows: {
              required: true,
              range: [-100, 100],
              greaterThan: "#minRows"
            }
          }, // end rules

          /*messages for the errors */
          messages: {
            minCols: {
              required: "Please enter a min column value.",
              lessThan: "Column Min must be smaller than Column Max."
            },
            maxCols: {
              required: "Please enter a max column value.",
              greaterThan: "Column Max must be greater than Column Min."
            },
            minRows: {
              required: "Please enter a min row value.",
              lessThan: "Row Min must be smaller than Row Max."
            },
            maxRows: {
              required: "Please enter a max row value.",
              greaterThan: "Row Max must be greater than Row Min."
            }
          } // end messages
        }); // end validate

       //function to obtain paramaters from the url bar
        $.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
        }
        
        // Get URL Query parameters. If null, set to default values
        var mnCols = parseInt(($.urlParam('minCols') !== null ? $.urlParam('minCols') : 0));
        var mxCols = parseInt(($.urlParam('maxCols') !== null ? $.urlParam('maxCols') : 1));        
        var mnRows = parseInt(($.urlParam('minRows') !== null ? $.urlParam('minRows') : 0));
        var mxRows = parseInt(($.urlParam('maxRows') !== null ? $.urlParam('maxRows') : 1));

        // Ensure the values in the fields are retained after
        // each submission
        $('#minCols').val(mnCols);
        $('#maxCols').val(mxCols);
        $('#minRows').val(mnRows);
        $('#maxRows').val(mxRows);

        // Remove any previously created table
        $("#placeholder").empty();

        // Calculate the number of rows and columns in the table
        var numCols = mxCols - mnCols;
        var numRows = mxRows - mnRows;

        // Put the mulitpliers and multiplicands into arrays for indexing
        var multipliers = new Array();
        var multiplicands = new Array();

        //array for multipliers (columns)
        for (mnCols; mnCols <= mxCols; mnCols++) {
          multipliers.push(mnCols);
        }
        for (mnRows; mnRows <= mxRows; mnRows++) {
          multiplicands.push(mnRows);
        }

        //variable tableMake is a string that will contain all of the code for the table
        var tableMake = "";
        tableMake += "<table>";
        
        //for loops that goes through the entered values and populates the correct numbers into the soon to be created table
        //it makes rows and columns with the arrays created above and multiplies the values together in the correct spaces
        for (var row = 0; row <= (numRows + 1); row++) {
            tableMake += "<tr>";
            for (var column = 0; column <= (numCols + 1); column++) {
                if (row == 0 && column == 0) {
                   tableMake += "<td class='empty'>" + "" + "</td>";
                } else if (row == 0 && column > 0) {
                   tableMake += "<td class='row0'>" + multipliers[column - 1] + "</td>";
                } else if (column == 0 && row > 0) {
                   tableMake += "<td class='col0'>" + multiplicands[row - 1] + "</td>";
                } else {
                   tableMake += "<td class='other'>" + (multipliers[column - 1] * multiplicands[row - 1]) + "</td>";
                }
            }
            tableMake += "</tr>";
        }
        tableMake += "</table>";
        
        //makes all of the objects with id table a html object that is comprised of the script in tableMake, which is the code for the table
        $('#table').html(tableMake);

});
