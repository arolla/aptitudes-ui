const EmployeeService = {
    all: async function() {
        return fetch("/employees")
            .then(result => result.json());
    },

    create: async function(employee) {
        return fetch("/employees", {
            method: 'POST',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
                Accept: 'application/json'
            }
        }).then(response => {
            handleFetchErrors(response);
            response.json();
        })
    },

    update: async function(employee) {
        return fetch("/employees/" + employee.id, {
            method: 'PUT',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
                Accept: 'application/json'
            }
        }).then(response => handleFetchErrors(response));
    },

    delete: async function(employee) {
        return fetch("/employees/" + employee.id, {
            method: 'DELETE',
        })
        .then(response => handleFetchErrors(response));
    },

    skills: async function() {
        return fetch("/skills")
            .then(result => result.json());
    },
}

function handleFetchErrors(response) {
    if (!response.ok)
        throw Error(response.statusText);
    return response;
}

export default EmployeeService;
