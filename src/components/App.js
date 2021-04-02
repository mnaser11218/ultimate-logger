import React, { Component } from "react";
import "../index.css";
import { io } from "socket.io-client";

import Log from "./Log";
import Request from "./Request";
import Response from "./Response";
import LogDetails from "./logDetails";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Button
} from "@chakra-ui/react";
import Log from "./Log";
import Request from "./Request";
import Response from "./Response";
import { serverPort } from "../../configConstants";

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: io('http://localhost:3861/', {transports: ['websocket']}),
      logs: []
    }
  }
  componentDidMount() {
    const { socket } = this.state;
    socket.on("display-logs", (msg) => {
      console.log("recieved message from server: ", msg);
      this.setState({logs: msg.allLogs});
    });
    fetch('/api/logs')
      .then(res => res.json())
      .then(res => {
        this.setState({logs: res.allLogs})
      })
  }

  sendWSMessageArrow = () => {
    console.log('inside sendWSMessage Arrow');
    this.state.socket.emit("chat message", "hi from client arrow");
      this.setState({ logs: msg.allLogs });
    });
    socket.emit("get-initial-logs");
  }

  componentWillUnmount() {
    const { socket } = this.state;
    socket.off("display-logs");
    socket.off("get-initial-logs");
  }

  deleteLogs = () => {
    const { socket } = this.state;
    socket.emit("delete-logs", true);
  };

  render() {
    const { logs } = this.state;
    console.log(`this.state.logs`, logs);
    return (
      <div>
        {/* <Button onClick={this.sendWSMessageArrow}>Yo Arrow</Button> */}
        <Table variant="simple">
        <TableCaption>Ultimate Logger</TableCaption>
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>TimeStamp</Th>
            <Th>Class</Th>
            <Th>Log</Th>
          </Tr>
        </Thead>
        <Tbody>
            {
              logs.map(log => {
                switch(log.class) {
                  case 'client':
                    return <Log log={log} />
                  case 'server':
                    return <Log log={log} />
                  case 'request':
                    return <Request request={log} />
                  case 'response':
                    return <Response response={log} />
                }
              })}
            </Tbody>
            {/* <Tfoot>
              <Tr>
                <Th>Type</Th>
                <Th>TimeStamp</Th>
                <Th>Class</Th>
                <Th>Log</Th>
              </Tr>
            </Tfoot> */}
          </Table>
        </div>

        <LogDetails logs={this.state.activeLog} />

        {/* <div>
          {this.state.showMoreLogInfo && (
            <div
              style={{
                float: "right",
                color: "orange",
                width: "70%",
                backgroundColor: "purple",
              }}
            >
              {" "}
             Type: {this.state.logs[this.state.logId].class}
             <br/>
         
              Log Type: {this.state.logs[this.state.logId].type}
              <br/> 
              Date: {this.state.logs[this.state.logId].timestamp}
              <br/>
              
              <br/>

              Log: 
              <br/>
              {this.state.logs[this.state.logId].log}
              
            </div>
          )}
        </div> */}
      <div>
        <Button onClick={this.deleteLogs}>Delete Logs</Button>
        <Table variant="simple">
          <TableCaption>Ultimate Logger</TableCaption>
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>TimeStamp</Th>
              <Th>Class</Th>
              <Th>Log</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs.map((log) => {
              switch (log.class) {
                case "client":
                  return (
                    <Log
                      log={log}
                      key={`${log.class}${log.type}${log.timestamp}${log.log}`}
                    />
                  );
                case "server":
                  return (
                    <Log
                      log={log}
                      key={`${log.class}${log.type}${log.timestamp}${log.log}`}
                    />
                  );
                case "request":
                  return (
                    <Request
                      request={log}
                      key={`${log.class}${log.method}${log.timestamp}${log.originalUri}`}
                    />
                  );
                case "response":
                  return (
                    <Response
                      response={log}
                      key={`${log.class}${log.responseStatus}${log.timestamp}`}
                    />
                  );
                default:
                  return <noscript />;
              }
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Type</Th>
              <Th>TimeStamp</Th>
              <Th>Class</Th>
              <Th>Log</Th>
            </Tr>
          </Tfoot>
        </Table>
      </div>
    );
  }
}

export default App;
