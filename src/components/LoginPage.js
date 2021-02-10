import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import "../styles/LoginPage.css";
import { useHistory } from "react-router-dom";
import { usePostQuery } from "../hooks/useAxiosQuery";

/** Displays the login screen of the app */
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const LoginPage = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const { data, error, refetch } = usePostQuery(
    "auth",
    "auth",
    "/auth",
    { email: email },
    { enabled: false }
  );

  useEffect(() => {
    if (data) {
      if (data && data.success === true && data.token) {
        setEmail(email);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("token", "Bearer " + data.token);
        history.push("/game-page");
      }
    }
  }, [data, history, email]);

  if (error) console.log(error);

  const onFinish = (values) => {
    console.log("Login Form values : ", values);
    setEmail(values.email);
    refetch();
  };

  return (
    <div className="center-content">
      <h2> Please Enter your email to Login! </h2>
      <Form {...layout} name="login" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ background: "#2eaf7d", border: "1px solid #2eaf7d" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
