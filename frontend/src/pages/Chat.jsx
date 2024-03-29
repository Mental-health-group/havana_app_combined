import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  console.log("UserChat", userChats);

  if (userChats === null || isUserChatsLoading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Stack direction="horizontal" gap={4} className="align-items-start">
        <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
          {isUserChatsLoading && <p>Loading chats...</p>}
          {userChats?.map((chat, index) => {
            return (
              <div key={index}>
                <UserChat chat={chat} user={user} />
              </div>
            );
          })}
        </Stack>
        <p>ChatBox</p>
      </Stack>
    </Container>
  );
};

export default Chat;
