import { useAuth } from '../firebase/auth';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import firebase from 'firebase/compat/app';
import cookie from "cookie";
import { useUserMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

const Account = ({ data }: {
  data: {
    [key: string]: string;
  }
}) => {
  const { authUser } = useAuth();
  const [loginVisible, setLoginVisible] = useState("flex");
  const [signupVisible, setSignUpVisible] = useState("none");
  const [, user] = useUserMutation();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    uid: '',
    id: 0,
    createdAt: ''
  });

  const loginOnClick = () => {
    setLoginVisible("none")
    setSignUpVisible("flex")
  }
  const SignUpOnlick = () => {
    setSignUpVisible("none")
    setLoginVisible("flex")
  }

  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    async function getUser() {
      if (authUser && firebase.auth().currentUser) {
        const response = await user({ uid: firebase.auth().currentUser!.uid })
        setUserData({
          username: response.data?.user.user?.username!,
          email: response.data?.user.user?.email!,
          uid: response.data?.user.user?.uid!,
          id: response.data?.user.user?.id!,
          createdAt: response.data?.user.user?.createdAt! // convert to readable date
        });
      }
    }
    getUser()
  }, [authUser, user])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", data.theme || "");
  }, [data.theme]);

  useEffect(() => {
    setContentLoaded(true);
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentLoaded) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 900);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [contentLoaded]);

  if (authUser) {
    return <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <button onClick={() => firebase.auth().signOut()}>SignOut</button>
        </>
      )}
    </>
  }
  else {
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
              <div style={{ display: loginVisible }}>
                <Login onClick={loginOnClick} />
              </div>
              <div style={{ display: signupVisible }}>
                <Signup onClick={SignUpOnlick} />
              </div>
            </div>
          </>
        )}
      </>)
  }
};

export default withUrqlClient(createUrqlClient)(Account);

export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; res: { writeHead: (arg0: number, arg1: { Location: string; }) => void; end: () => void; }; }) {
  const data = cookie.parse(context.req ? context.req.headers.cookie || "" : document.cookie)

  if (context.res) {
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      context.res.writeHead(301, { Location: "/" })
      context.res.end()
    }
  }

  return { props: { data: data && data } }
}