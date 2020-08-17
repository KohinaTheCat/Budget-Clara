import React, { useState } from "react";
import { Checkbox, TableRow, TableCell, TextField } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function List(props) {
    //replace with redux
  let [when, setWhen] = useState(Date.parse(props.when));
  let [amount, setAmount] = useState(props.amount);
  let [what, setWhat] = useState(props.what);
  let id  = props.id;
  let [where, setWhere] = useState(props.where);
  let [essential, setEssential] = useState(props.essential);
  let [edit, setEdit] = useState(false);

  let onEditChange = () => {
    setEdit(!edit);
  };

  let cells = (
    <>
      <TableCell>{props.when.substring(0, 10)}</TableCell>
      <TableCell>${amount}</TableCell>
      <TableCell>{where}</TableCell>
      <TableCell>{what}</TableCell>
      <TableCell align="center">{essential}</TableCell>
      <TableCell align="center" style={{ width: "80px" }}>
        <a href="#" onClick={() => props.deleteItem(props.id)}>
          delete
        </a>{" "}
        |{" "}
        <a href="#" onClick={onEditChange}>
          edit
        </a>
      </TableCell>
    </>
  );

  //figure out way to reduce code duplication
  let onAmountChange = (e) => {
    setAmount(e.target.value);
  };

  let onWhereChange = (e) => {
    setWhere(e.target.value);
  };

  let onWhatChange = (e) => {
    setWhat(e.target.value);
  };

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
        id: id
      };
    axios
      .post("http://localhost:5000/transactions/" + id, newItem)
      .then((res) => console.log(res.data))
      .then(onEditChange())
      .catch(err => console.log(err))
  }

  let editCells = (
    <>
      <TableCell>
        <DatePicker selected={when} onChange={(date) => setWhen(date)} />
      </TableCell>
      <TableCell align="center">
        <TextField
          style={{ width: "66px" }}
          label={amount}
          onChange={onAmountChange}
        ></TextField>
      </TableCell>
      <TableCell align="center">
        <TextField label={where} onChange={onWhereChange}></TextField>
      </TableCell>
      <TableCell align="center">
        <TextField label={what} onChange={onWhatChange}></TextField>
      </TableCell>
      <TableCell align="center">
        <Checkbox checked = {essential === "yes"} onClick={onEssentialChange}></Checkbox>
      </TableCell>
      <TableCell align="center">
        <a href="#" type="submit" onClick={callEdit}>
          update
        </a>
      </TableCell>
    </>
  );

  return parseInt(props.amount) < 0 ? (
    <TableRow id={id} style={{ backgroundColor: "#fcedf0" }}>
      {edit ? editCells : cells}
    </TableRow>
  ) : (
    <TableRow id={id} style={{ backgroundColor: "#f0fffa" }}>
      {edit ? editCells : cells}
    </TableRow>
  );
}

export default List;
