import React from 'react';
import styles from "./index.module.scss";
import {Link} from "ice";

const Home = () => {
  return <div className={styles.container}>

    <ul>
      <li>
        <Link to={'/ace'}>AceJs编辑器DEMO</Link>
      </li>
    </ul>
  </div>;
};

export default Home;
