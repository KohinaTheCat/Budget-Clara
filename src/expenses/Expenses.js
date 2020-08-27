import React, { Component } from "react";
import {
  Card,
  Typography,
  Checkbox,
  IconButton,
  TableCell,
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
      amount: null,
      where: "",
      what: "",
      when: new Date(),
      essential: "no",
      total: 0,
      page: 0,
      count: 0,
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    axios
      .get("http://localhost:5000/transactions")
      .then((res) => {
        this.setState({ list: res.data });
      })
      .catch((err) => console.log(err));

    //call to get total amount from db
    axios
      .get("http://localhost:5000/transactions/total")
      .then((res) => {
        this.setState({ total: res.data[0].total });
      })
      .catch((err) => console.log(err));
  }

  deleteItem(id) {
    axios
      .delete("http://localhost:5000/transactions/" + id)
      .then((res) => this.update());

    this.setState({
      list: this.state.list.filter((i) => i._id !== id),
    });
  }

  resetTextFields() {
    this.setState({
      amount: "",
      where: "",
      what: "",
      when: new Date(),
      essential: "no",
      total: 0,
      page: 0,
      count: 0,
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
    console.log(newItem);
    axios
      .post("http://localhost:5000/transactions/", newItem)
      .then((res) => console.log(res.data))
      .then(this.update())
      .then(this.resetTextFields());
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
      <div className="background">
        <Card className="container">
          <TableContainer component={Card}>
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
                  <TableCell align="center">
                    <TextField
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
          </TableContainer>
        </Card>
      </div>
    );
  }
}

export default Expenses;
