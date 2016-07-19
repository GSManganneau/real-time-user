/**
 * Created by stephane.manganneau on 03/05/2016.
 */
var mongoose =  require('mongoose');
var ipAdress = '127.0.0.1';

//connection database
var db = mongoose.connect("mongodb://"+ipAdress+"/usersdata",function () {
           console.log('connected to database');
});

var userSchema = db.Schema({
    imsi: String,
    volume : String,
    lon : String,
    lat : String,
    date: Date
});
var User = db.model('user',userSchema);

var addUser = function(user){
    User.findOne({ imsi: user.imsi },  function (err, result) {
        if (err) return handleError(err);
        if(result == null){
            User.create({imsi:user.imsi , lat : user.lat , lon : user.lon , date: Date(), volume : user.volume},function(){
                console.log("User created");
            })
        }
        else{
            // Space Ghost is a talk show host.
            var resultVolume = parseInt(result.volume);
            console.log(result);
            var userVolume = parseInt(user.volume);
            console.log(user.volume);
            var newVolume = resultVolume + userVolume;
            newVolume = newVolume.toString()
            User.update({ imsi: user.imsi },{$set:{lon:user.lon , lat:user.lat,volume:newVolume,date : Date()}},function(){
                console.log("User up to date");
            })
        }
    })
}

exports.createConnection = db;
exports.addUser = addUser;



