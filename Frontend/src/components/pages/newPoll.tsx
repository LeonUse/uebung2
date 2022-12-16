import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewPoll() {
  const [poll, setPoll] = React.useState<String>("");
  const [options, setOptions] = React.useState<String[]>([""]);
  const navigate = useNavigate();
  const id = generateString(8);
  const handleChangePoll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoll(event.target.value);
  };

  const handleChangeOption =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let newArr = [...options];
      newArr[index] = event.target.value;
      setOptions(newArr);
      console.log("handleCangeOption", index);
    };

  const handleChangeOption1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions([event.target.value]);
  };

  const addOption = () => {
    let a = [""];
    setOptions((oldArray) => [...oldArray, ""]);
  };

  const startPoll = () => {
    const newPoll = {
      id: id,
      poll: poll,
      options: options,
    };

    axios
      .post("http://localhost:9000/createPoll", newPoll)
      .then((response: any) => {
        console.log(response.data);
        navigate("/activePolls/" + id);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  // program to generate random strings// declare all charactersconst characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length: number) {
    let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <div className="newPoll">
      <Box sx={{ flexgrow: 1 }}>
        <Grid container spacing={2} sx={{ fontSize: "2rem" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="standard-multiline-static"
              label="Poll"
              multiline
              rows={1}
              helperText="your question"
              variant="standard"
              value={poll}
              onChange={handleChangePoll}
            />
          </Grid>
          {options.map((option, index) => (
            <Grid item xs={6} key={index}>
              <TextField
                fullWidth
                label={"option " + (index + 1)}
                multiline
                rows={1}
                value={option}
                onChange={handleChangeOption(index)}
                variant="standard"
              />
            </Grid>
          ))}
        </Grid>
        <Stack
          direction="row"
          justifyContent="space-between"
          marginTop="2rem"
          spacing={0.5}
        >
          <Button variant="outlined" onClick={addOption}>
            Add Option
          </Button>
          <Button variant="outlined" onClick={startPoll}>
            Start Poll
          </Button>
        </Stack>
      </Box>
    </div>
  );
}
