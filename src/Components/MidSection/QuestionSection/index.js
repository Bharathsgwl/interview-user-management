import React from "react";
import "./index.css";
import { Card, Button, Grid } from "@material-ui/core";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Dialogbox from "../../Dialogbox";
import Icon from "@material-ui/core/Icon";
import AnswerList from "../AnswerList";
import {
  handleOnOption,
  handleOnOptioncapture,
  handleOnClickSubmit
} from "../../../redux/actions";

import axios from "axios";

class QuestionSection extends React.Component {
  state = {
    questions: [],
    options: [],
    index: 0,
    open1: false,
    disabled1: true,
    disabled4: false,
    disabled6: true,
    q_lis: [],
    user_answer: [],
    u_ans:'',
    flag: false
  };

  handleOnClickNext = e => {
    let { index, disabled1, disabled4, disabled6 } = this.state;
    let { questions } = this.props;
    console.log(index, "ttt");
    const baseURL = "http://localhost:8080/api";
    debugger;

    if (index < questions.length - 1) {
      if (index === this.props.questions.length - 2) {
        this.setState({
          disabled4: true,
          disabled6: false
        });
      }

      this.setState({
        index: index + 1,
        disabled1: false
      });
    }
  };
  handleOnClickPrevious = () => {
    var { index, disabled4 } = this.state;
    let { questions } = this.props;
    if (index === 1) {
      this.setState({
        disabled1: true
      });
    }
    if (index < questions.length) {
      this.setState({
        disabled6: true
      });
    }

    if (index < questions.length) {
      this.setState({
        disabled4: false
      });
    }

    this.setState({
      index: index - 1
    });
  };

  render() {
    console.log(this.props.questions, "props");

    debugger;
    const {
      questions = [],
      handleOnOption,
      handleOnOptioncapture,
      handleOnClickSubmit
    } = this.props;

    const { disabled1, disabled4, disabled6, index, q_lis } = this.state;
    let { user_answer ,u_ans} = this.state;
    console.log("task-list", user_answer);
    console.log(u_ans,"user_answer");

    const postAnswer = e => {
      const baseURL = "http://localhost:8080/api/";
      debugger;
      axios.get(baseURL + "/" + "user_candidate_answer").then(response => {
        user_answer = response.data.user_ans.map(user => user.question_id);
        console.log(user_answer, "user");
        // console.log(user_answer[index],"answers");
        console.log(questions, "questions");
        let question = questions.map(q => q.q_uuid);
        console.log(question, "question");
        console.log(question[index], "q_index");
        debugger
        user_answer.forEach(us => {
          if(question[index] === us){
        this.state.flag=true;
        this.setState({
          flag: true,
          u_ans:e
        })
        console.log(user_answer,"ans");
      }
    })
  if(this.state.flag){
    this.setState({
      flag: false
    })
      return axios
              .put(baseURL + "/" + "candidate_answer",{
                question_id: questions[index].q_uuid,
                c_answer: this.state.u_ans
              })
              .then(response => {
                let res = response;
                console.log(res, "user_response");
              });
            console.log("put method");
        }else{
          console.log(u_ans,"user_a");
          return axios
              .post(baseURL + "/" + "candidate_answer", {
                question_id: questions[index].q_uuid,
                user_id:"GWL123",
                c_answer: this.state.u_ans
              })
              .then(response => {
                let res = response;
                console.log(res, "user_response");
              });
        }
});
          debugger;
        }

    console.log(index, "current_index");
    const q_List = questions.length ? (
      questions.map((q, index) => {
        // console.log(this.props.questions[index].q_name, "index")
        console.log(index, "i");
        debugger;
        return (
          <Card key={index + 1} classes={{ root: "questionsectionstyle" }}>
            <ul>
              {index + 1}
              {"."} {questions[index].q_name}
              <RadioGroup
                key={index + 1}
                onChange={e => {
                  postAnswer(e.target.value);
                }}
                value={this.state.u_ans}
              >
                {q.options.map((o, index) => (
                  <FormControlLabel
                    value={o}
                    control={<Radio />}
                    label={o}
                    style={{ display: "inline-block" }}
                  />
                ))}
              </RadioGroup>
            </ul>
          </Card>
        );
      })
    ) : (
      <div>no questions</div>
    );


    return (
      <div>
        {q_List[this.state.index]}
        <br />
        <Grid container>
          <Grid item md={6}>
            <Button
              classes={{ root: "previousbutton" }}
              variant="contained"
              color="primary"
              onClick={this.handleOnClickPrevious}
              disabled={disabled1}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={5}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: "nextbuttonstyle" }}
              onClick={this.handleOnClickNext}
              disabled={disabled4}
            >
              Next
            </Button>
          </Grid>
          <Grid item md={1}>
            <Dialogbox text={this.state.text} />
            <Button
              color="primary"
              variant="contained"
              classes={{ root: "submitstyle" }}
              disabled={disabled6}
              onClick={handleOnClickSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ q_List }) => {
  return {
    q_List
  };
};
const mapDispatchToProps = dispatch => {
  return {
    handleOnOption: optionname => {
      dispatch(handleOnOption(optionname));
    },
    handleOnOptioncapture: () => {
      dispatch(handleOnOptioncapture());
    },
    handleOnClickSubmit: () => {
      dispatch(handleOnClickSubmit());
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(QuestionSection));
