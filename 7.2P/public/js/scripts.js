const socket = io();

function vote(person) {

    socket.emit("vote", person);

    M.toast({
        html: `Vote submitted for ${person}`
    });

}

socket.on("updateVotes", (votes) => {

    document.getElementById("vote-john").innerText = votes.john;
    document.getElementById("vote-emma").innerText = votes.emma;
    document.getElementById("vote-michael").innerText = votes.michael;

});