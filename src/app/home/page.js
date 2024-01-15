import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function Header({title}) {
  return <h1>{title}</h1>;
}

export default function Home() {
  return (
    <>
    <Header title="World's worst login ever"/>
    <LoginForm/>
    <RegisterForm/>
    </>
  )
}
