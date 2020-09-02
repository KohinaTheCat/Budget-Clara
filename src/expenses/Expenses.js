import React, { Component } from "react";
import {
  Card,
  Typography,
  Checkbox,
  IconButton,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  TableFooter,
  TablePagination,
} from "@material-ui/core";
import AddCircleSharpIcon from "@material-ui/icons/AddCircleSharp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import List from "../list/List";
import { green } from "@material-ui/core/colors";
import "./expenses.css";
import Graph from "../graph/Graph";

/*
    Getting data from database and displaying it in a table.
*/
export class Expenses extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);

    //REPLACE WITH REDUX
    this.state = {
      list: [],
      amount: "",
      where: "",
      what: "",
      when: new Date(),
      essential: "no",
      total: 0,
      gain: 0,
      loss: 0,
      page: 0,
      count: 0,
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    axios
      .get("/transactions")
      .then((res) => {
        this.setState({ list: res.data });
      })
      .catch((err) => console.log(err));

    //call to get total amount from db
    axios
      .get("/transactions/total")
      .then((res) => {
        this.setState({ total: res.data[0].total, gain: res.data[0].gain, loss: res.data[0].loss });
      })
      .catch((err) => console.log(err));
  }

  deleteItem(id) {
    axios
      .delete("/transactions/" + id)
      .then((res) => this.update());
  }

  resetTextFields() {
    this.setState({
      amount: "",
      where: "",
      what: "",
    });
  }

  addItem() {
    const newItem = {
      when: this.state.when,
      amount: parseFloat(this.state.amount),
      where: this.state.where,
      what: this.state.what,
      essential: this.state.essential,
    };

    axios
      .post("/transactions/", newItem)
      .then(this.resetTextFields())
      .then((res) => this.update());
  }

  displayList() {
    return this.state.list
      .slice(this.state.page * 5, this.state.page * 5 + 5)
      .map((current, i) => {
        return (
          <List
            key={current._id}
            amount={current.amount}
            where={current.where}
            essential={current.essential}
            what={current.what}
            when={current.when}
            id={current._id}
            deleteItem={this.deleteItem}
          />
        );
      });
  }

  onEssentialChange = (e) => {
    if (e.target.checked) {
      this.setState({ essential: "no" });
    } else {
      this.setState({ essential: "yes" });
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  TablePaginationActions = () => {
    this.setState({ page: this.state.page + 1 });
  };

  render() {
    //    EDIT: DEF. PUT THIS INTO A REUSABLE COMPONENT.
    const ExampleCustomInput = ({ value, onClick }) => (
      <Button variant="contained" color="primary" onClick={onClick}>
        {value}
      </Button>
    );

    return (
      <Card className="background">
        <Card className="container">
          <TableContainer component={Card}>
            <Table>
              {/* top labels */}
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Place</b>
                  </TableCell>
                  <TableCell>
                    <b>Description</b>
                  </TableCell>
                  <TableCell>
                    <b>Essential</b>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {/* add additional transaction */}
              {/* EDIT: SEE IF THIS CAN BE REDUCED TO A COMPONENT */}
              <TableHead>
                <TableRow>
                  <TableCell>
                    <DatePicker
                      selected={this.state.when}
                      onChange={(date) => this.setState({ when: date })}
                      customInput={<ExampleCustomInput />}
                    />
                  </TableCell>
                  {["amount", "where", "what"].map((name) => (
                    <TableCell key={name + "1"} align="center">
                      <TextField
                        key={name + "2"}
                        id="outlined-basic"
                        variant="outlined"
                        value={this.state[name]}
                        onChange={(e) =>
                          this.setState({ [name]: e.target.value })
                        }
                      ></TextField>
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Checkbox
                      style={{ color: green[500] }}
                      onChange={this.onEssentialChange}
                    ></Checkbox>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={this.addItem}>
                      <AddCircleSharpIcon color="primary"></AddCircleSharpIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* total from db */}
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      Total: {this.state.total < 0 ? "-" : ""}$
                      {Math.abs(this.state.total.toFixed(2))}
                    </Typography>
                  </TableCell>
                </TableRow>
                {/* display all transactions */}
                {this.displayList()}
              </TableBody>
              {/* page control */}
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    colSpan={6}
                    count={this.state.list.length} //total amount of transactions
                    rowsPerPage={5}
                    page={this.state.page} //page you are on
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={this.handleChangePage}
                    // ActionsComponent={this.TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Card>

        <Graph total={this.state.total} gain={this.state.gain} loss={this.state.loss}></Graph>
      </Card>
    );
  }
}

export default Expenses;
