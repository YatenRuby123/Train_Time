var url = "https://train-time-107c4.firebaseio.com/";
var dataRef = new Firebase(url);
var name = '';
var dest = '';
var frstTrTm = '';
var freq = '';
var nextTrain = '';
var nxtTrnForm = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyhold = '';
var getKey = '';


$(document).ready(function() {

    $("#addTrainBtn").on("click", function() {
        name = $('#name-input').val().trim();
        dest = $('#destination-input').val().trim();
        frstTrTm = $('#first-train-time-input').val().trim();
        freq = $('#frequency-input').val().trim();
        firstTimeConverted = moment(frstTrTm, "hh:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        tRemainder = diffTime % freq;
        minutesTillTrain = freq - tRemainder;
        nextTrain = moment().add(minutesTillTrain, "minutes");
        nxtTrnForm = moment(nextTrain).format("hh:mm");


        keyhold = dataRef.push({
            name: name,
            destination: dest,
            firstTrainTime: frstTrTm,
            frequency: freq,
            nextTrainFormatted: nxtTrnForm,
            minutesTillTrain: minutesTillTrain
        });

        $('#name-input').val('');
        $('#destination-input').val('');
        $('#first-train-time-input').val('');
        $('#frequency-input').val('');

        return false;
    });
    dataRef.on("child_added", function(childSnapshot) {

        $('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
            "<td class='col-xs-3'>" + childSnapshot.val().name +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().destination +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().frequency +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted +
            "</td>" +
            "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain +
            "</td>" +
            "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
            "</tr>");

    }, function(errorObject) {});

    $("body").on("click", ".remove-train", function() {
        $(this).closest('tr').remove();
        getKey = $(this).parent().parent().attr('id');
        dataRef.child(getKey).remove();
    });

});