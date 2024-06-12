import NavBar from "../lib/components/NavBar";

function Header({title}) {
  return <h1>{title}</h1>;
}

export default function Home() {
  return (
    <>
    <Header title='What the zuck'/>
    </>
  )
}
