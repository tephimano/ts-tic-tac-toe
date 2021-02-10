import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import SquaresBoard from "./GameComponents/SquaresBoard";

/** Display the layout for the game page */
const { Header, Content } = Layout;
const GamePage = () => {
  const history = useHistory();
  return (
    <div style={{ color: "#008080" }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <div style={{ float: "right" }}>
            <Button
              type="primary"
              style={{ background: "#2eaf7d", border: "1px solid #2eaf7d" }}
              icon={<LogoutOutlined />}
              onClick={() => {
                console.log("Logout Button Pushed");
                history.push("/logout");
              }}
            />
          </div>
        </Header>
        <Content>
          <SquaresBoard />
        </Content>
      </Layout>
    </div>
  );
};

export default GamePage;
