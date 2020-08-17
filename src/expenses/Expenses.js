import React, { Component } from "react";
import {
  Paper,
  Checkbox,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import List from "../list/List";
import "./expenses.css";

export class Expenses extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);

    this.state = {
      list: [],
      amount: 0,
      where: "home",
      what: "nothing",
      when: new Date(),
      essential: "no",
      total: 0,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/transactions")
      .then((res) => {
        this.setState({ list: res.data });
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/transactions/total")
      .then((res) => {
        this.setState({ total: res.data[0].total });
      })
      .catch((err) => console.log(err));
  }

  displayList() {
    return this.state.list.map((current) => {
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

  deleteItem(id) {
    axios.delete("http://localhost:5000/transactions/" + id);

    this.setState({
      list: this.state.list.filter((i) => i._id !== id),
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
      .post("http://localhost:5000/transactions/", newItem)
      .then((res) => console.log(res.data));

    //find a way for this to automatcally reload b/c we dont have id of this item lolz
  }

  onAmountChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  onWhereChange = (e) => {
    this.setState({ where: e.target.value });
  };

  onWhatChange = (e) => {
    this.setState({ what: e.target.value });
  };

  onEssentialChange = (e) => {
    if (e.target.checked) {
      this.setState({ essential: "no" });
    } else {
      this.setState({ essential: "yes" });
    }
  };

  onDateChange = (date) => {
    this.setState({
      when: date,
    });
  };

  render() {
    return (
      <div className="background">
        <Paper className="container">
          <TableContainer>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell align="center">
                  <b>Amount</b>
                </TableCell>
                <TableCell align="center">
                  <b>Where</b>
                </TableCell>
                <TableCell align="center">
                  <b>What</b>
                </TableCell>
                <TableCell align="center">
                  <b>Essential</b>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>
                  <DatePicker
                    selected={this.state.when}
                    onChange={this.onDateChange}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    style={{ width: "66px" }}
                    label="amount"
                    onChange={this.onAmountChange}
                  ></TextField>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="where"
                    onChange={this.onWhereChange}
                  ></TextField>
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="what"
                    onChange={this.onWhatChange}
                  ></TextField>
                </TableCell>
                <TableCell align="center">
                  <Checkbox onChange={this.onEssentialChange}></Checkbox>
                </TableCell>
                <TableCell align="center">
                  <a href="#" type="submit" onClick={this.addItem}>
                    add
                  </a>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableRow>
              <br />
              <b>Total: ${this.state.total.toFixed(2)}</b>
              <br />
            </TableRow>
            <TableBody>{this.displayList()}</TableBody>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

export default Expenses;
