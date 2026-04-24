function calculate(operation) {

    let num1 = document.getElementById("number1").value;
    let num2 = document.getElementById("number2").value;

    if (!num1 || !num2) {
        M.toast({html: "Please enter numbers"});
        return;
    }

    fetch(`/api/calculator?num1=${num1}&num2=${num2}&operation=${operation}`)
    .then(response => response.json())
    .then(data => {

        if(data.status === "success"){
            document.getElementById("result").innerText = data.result;
        } else {
            M.toast({html: data.message});
        }

    })
    .catch(error => {
        console.log(error);
    });

}