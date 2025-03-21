import React, { FC } from 'react';
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout";

const Vehicle: FC = () => {
  return(
    <SidebarLayout>
    <Navbar title="Vehicle" subTitle="Dashboard" />
    <div>Vehicle</div>
  </SidebarLayout>
  )

};

export default Vehicle;


