const express = require('express');
const app = express();
const port = 3000;

const JSONDatabase = require('./JSONDatabase');

const Devices = new JSONDatabase('./data/devices.json');
const Automations = new JSONDatabase('./data/automations.json');

app.use(express.json());

// Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


function responseError(res, message) {
    message = message || ''
    res.status(400).json({ success: false, message });
}

function responseFail(res, message) {
    message = message || ''
    res.status(200).json({ success: false, message });
}

function responseSuccess(res, message) {
    message = message || ''
    res.status(200).json({ success: true, message });
}

function responseJson(res, data) {
    res.status(200).json(data);
}


// GET `/`
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});



// GET `/device`
app.get('/device', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return responseError(res, 'Missing id parameter');
    }

    const device = Devices.get({ id });
    if (device) {
        responseJson(res, device);
    } else {
        responseError(res, 'Device not found');
    }
});



// GET `/devices`
app.get('/devices', (req, res) => {
    responseJson(res, Devices.getAll());
});



// POST `/auto/enable`
app.post('/auto/enable', (req, res) => {
    let { id, disable } = req.query;
    disable = disable !== undefined ? true : false;
    if (!id) {
        return responseError(res, 'Missing id parameter');
    }
    let at = Automations.get({ id });
    if (!at) {
        return responseError(res, 'Automation not found');
    }
    at.enabled = !disable;
    Automations.update({ id }, at);
    responseSuccess(res, `Automation ${disable ? 'disabled' : 'enabled'} successfully`);
});



// POST `/auto/remove`
app.post('/auto/remove', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return responseError(res, 'Missing id parameter');
    }
    Automations.remove({ id });
    responseSuccess(res, 'Automation removed successfully');
});



// POST `/auto/remove-all`
app.post('/auto/remove-all', (req, res) => {
    Automations.clear();
    responseSuccess(res, 'All automations removed successfully');
});



// GET `/auto/get`
app.get('/auto/get', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return responseJson(res, Automations.getAll());
    }
    const at = Automations.get({ id });
    if (at) {
        responseJson(res, at);
    } else {
        responseError(res, 'Automation not found');
    }
});



// POST `/auto/add-update`
app.post('/auto/add-update', (req, res) => {
    const { body } = req;
    console.log(body)
    // @TODO Validate body
    responseError(res, 'Not implemented');
});



// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





/* =========== Updating ============= */

// // POST `/pair`
// app.post('/pair', (req, res) => {
//     const newDevice = req.body;
//     devices.push(newDevice);
//     res.status(201).json({ message: 'Device paired successfully', device: newDevice });
// });



// // POST `/unpair`
// app.post('/unpair', (req, res) => {
//     const id = req.body.id;
//     devices = devices.filter(d => d.id !== id);
//     res.status(200).json({ message: 'Device unpaired successfully' });
// });



// // POST `/command`
// app.post('/command', (req, res) => {
//     const { id, command } = req.body;
//     const device = devices.find(d => d.id === id);

//     if (!device) {
//         return res.status(404).json({ error: 'Device not found' });
//     }

//     // Handle the command here
//     res.status(200).json({ message: `Command ${command} sent to device ${id}` });
// });



// // POST `/restart`
// app.post('/restart', (req, res) => {
//     // Restart logic here
//     res.status(200).json({ message: 'Server restarting...' });
// });



// // POST `/sync`
// app.post('/sync', (req, res) => {
//     // Sync logic here
//     res.status(200).json({ message: 'Devices synced successfully' });
// });