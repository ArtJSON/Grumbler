import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  BellRinging,
  Home2,
  Login,
  ServerBolt,
  Settings,
  TrendingUp,
  User,
} from "tabler-icons-react";
import classes from "./Sidebar.module.scss";

export function Sidebar() {
  const { data: sessionData } = useSession();

  return (
    <nav className={classes.sidebar}>
      <ul className={classes.optionList}>
        <Link className={classes.option} href="#">
          <Home2 size={32} strokeWidth={2} color={"black"} />
          <span className={classes.optionText}>Home</span>
        </Link>
        <Link className={classes.option} href="#">
          <TrendingUp size={32} strokeWidth={2} color={"black"} />
          <span className={classes.optionText}>Trending</span>
        </Link>
        <Link className={classes.option} href="#">
          <BellRinging size={32} strokeWidth={2} color={"black"} />
          <span className={classes.optionText}>Notifications</span>
        </Link>
        {sessionData ? (
          <>
            <Link
              className={`${classes.option} ${classes.desktopOnly}`}
              href="#"
            >
              <Settings size={32} strokeWidth={2} color={"black"} />
              <span className={classes.optionText}>Settings</span>
            </Link>
            <Link className={classes.option} href="#">
              {sessionData.user.image ? (
                <Image
                  src={sessionData.user.image}
                  alt="User picture"
                  width={32}
                  height={32}
                />
              ) : (
                <User size={32} strokeWidth={2} color={"black"} />
              )}
              <span className={classes.optionText}>Profile</span>
            </Link>
          </>
        ) : (
          <div className={classes.option} onClick={() => signIn()}>
            <Login size={32} strokeWidth={2} color={"black"} />
            <span className={classes.optionText}>Sign in</span>
          </div>
        )}

        {sessionData?.user.role !== "USER" && (
          <Link className={`${classes.option} ${classes.desktopOnly}`} href="#">
            <ServerBolt size={32} strokeWidth={2} color={"black"} />
            <span className={classes.optionText}>Admin panel</span>
          </Link>
        )}
      </ul>
    </nav>
  );
}
