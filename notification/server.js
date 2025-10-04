import app from "./src/app.js";
import { connect } from "./src/broker/rabbit.js"
import listner from "./src/broker/listner.js";

connect().then(() => {
    listner();
})

app.listen(3001, () => {
    console.log("Notification Server is running on port 3001");
})