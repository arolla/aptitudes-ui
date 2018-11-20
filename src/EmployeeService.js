const EmployeeService = {
    all: async function() {
        return fetch("/employees")
            .then(result => result.json());
    },

    create: async function(employee) {
        return fetch("/employees", {
            method: 'POST',
            body: employee,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
                Accept: 'application/json'
            }
        }).then(response => {
            handleFetchErrors(response);
            response.json();
        })
    },

}

function handleFetchErrors(response) {
    if (!response.ok)
        throw Error(response.statusText);
    return response;
}

export default EmployeeService;