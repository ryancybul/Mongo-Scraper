var mongoose = require("mongoose");

//Save a reference to the Scheme constructor
var Schema = mongoose.Schema

//Schema Constructor
var NoteSchema = new Schema({
    //`note` is required and type of String
    note: {
        type: String,
        require: true
    }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

//Export the Note Model
module.exports = Note;
