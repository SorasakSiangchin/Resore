/* eslint-disable jsx-a11y/alt-text */
import React , {useEffect} from 'react';
import Slider from "react-slick";
import { useAppDispatch } from '../../app/store/configureStore';
import { setScreen } from './homeSlice';
const HomePage = () => {
  const dispatch = useAppDispatch();
 
  useEffect(()=>{
    dispatch(setScreen());
    return () => {dispatch(setScreen())};
  },[dispatch]);
  console.log(Math.random() * 1000);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <>
        <Slider {...settings}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => <img src={`https://picsum.photos/200/${item * 100}`} width={100} height={600} />)}
        </Slider>
      </>
  )
}

export default HomePage;