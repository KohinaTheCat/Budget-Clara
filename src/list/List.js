import React, { useState } from "react";
import {
  Checkbox,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Button,
} from "@material-ui/core";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import { green } from "@material-ui/core/colors";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

/*
    Display each individual transaction, and check for change.
*/
function List(props) {
  // I could make this a stateful component, but I want to play with hooks

  let [when, setWhen] = useState(Date.parse(props.when));
  let [amount, setAmount] = useState(props.amount);
  let [what, setWhat] = useState(props.what);
  let [where, setWhere] = useState(props.where);
  let [essential, setEssential] = useState(props.essential);
  let [edit, setEdit] = useState(false);
  let id = props.id;

  let onEditChange = () => {
    setEdit(!edit);
  };

  let cells = (
    <TableRow id={id}>
      <TableCell>{props.when.substring(0, 10)}</TableCell>
      <TableCell>
        {amount < 0 ? "-" : ""}${Math.abs(parseFloat(amount).toFixed(2))}
      </TableCell>
      <TableCell>{where}</TableCell>
      <TableCell>{what}</TableCell>
      <TableCell align="center">
        {essential === "yes" ? (
          <CheckSharpIcon style={{ color: green[600] }} />
        ) : (
          <ClearSharpIcon color="secondary" />
        )}
      </TableCell>
      <TableCell align="center" style={{ width: "80px" }}>
        <IconButton onClick={onEditChange}>
          <EditSharpIcon />
        </IconButton>
        <IconButton onClick={() => props.deleteItem(props.id)}>
          <DeleteSharpIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  let onEssentialChange = (e) => {
    if (e.target.checked) {
      setEssential("yes");
    } else {
      setEssential("no");
    }
  };

  let callEdit = () => {
    const newItem = {
      when: new Date(when),
      amount: parseFloat(amount),
      where: where,
      what: what,
      essential: essential,
      id: id,
    };
    axios
      .post(
        "/transactions/" + id,
        newItem
      )
      .then(onEditChange())
      //   .then((res) => update())
      .catch((err) => console.log(err));
  };

  const ExampleCustomInput = ({ value, onClick }) => (
    <Button variant="contained" color="primary" onClick={onClick}>
      {value}
    </Button>
  );

  let editCells = (
    <TableRow id={id}>
      <TableCell>
        <DatePicker
          selected={when}
          onChange={(date) => this.setWhen(date)}
          customInput={<ExampleCustomInput />}
        />
      </TableCell>

      <TableCell align="center">
        <TextField
          style={{ width: "66px" }}
          label={amount}
          onChange={(e) => setAmount(e.target.value)}
        ></TextField>
      </TableCell>

      <TableCell align="center">
        <TextField
          label={where}
          onChange={(e) => setWhere(e.target.value)}
        ></TextField>
      </TableCell>

      <TableCell align="center">
        <TextField
          label={what}
          onChange={(e) => setWhat(e.target.value)}
        ></TextField>
      </TableCell>

      <TableCell align="center">
        <Checkbox
          checked={essential === "yes"}
          style={{ color: green[500] }}
          onClick={onEssentialChange}
        ></Checkbox>
      </TableCell>

      <TableCell align="center">
        <IconButton onClick={callEdit}>
          <ArrowForwardIosIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return <>{edit ? editCells : cells}</>;
}

export default List;
