import { Button, Col, Flex, List, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const ServerError: React.FC = () => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();

  const redirectToLoginHandler = async () => {
    navigate("/");
  };

  const data = [
    "Ensure that you are connected to the internet.",
    "Try clearing your browser's cache and cookies.",
    "The issue might be temporary. Please try again later.",
    "If the problem persists, please contact our support team.",
  ];

  // Internal styles
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    backgroundColor: "var(--page-background)",
  };

  const imageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBlockStart: "85px",
  };

  const imageStyle = {
    background: "url('../../../assets/images/server-error.jpg') no-repeat",
    width: "495px",
    height: "300px",
    backgroundSize: "contain",
    backgroundPosition: "center",
  };

  return (
    <Row
    data-testid="serverError"
    align="middle"
    justify="center"
    style={containerStyle}
    className="flex flex-col items-center"
    >
    <Col span={24} className="text-center">
        <div style={imageContainerStyle}>
        <div style={imageStyle} />
        </div>
        <Title 
        level={2} 
        className="mt-4 text-[28px] font-semibold text-[var(--t-primary)]"
        >
        Something went wrong!
        </Title>
        <Text className="text-[var(--t-primary)] mb-12 block">
        We encountered an unexpected error.
        </Text>
    </Col>
    <Col className="w-full max-w-2xl px-5 sm:px-0">
        <List
        bordered
        dataSource={data}
        renderItem={(item) => (
            <List.Item>
            <span dangerouslySetInnerHTML={{ __html: item }} />
            </List.Item>
        )}
        />
        <Flex align="center" justify="center" className="mt-4">
        <Text>
            You can return to the{" "}
            <Button
            type="link"
            className="p-0 text-[14px] font-medium text-[var(--t-primary)]"
            onClick={redirectToLoginHandler}
            >
            login
            </Button>{" "}
            page and navigate from there.
        </Text>
        </Flex>
    </Col>
    </Row>
  );
};

export default ServerError;