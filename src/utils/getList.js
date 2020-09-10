import React from "react";
import {
  ListItem,
  IconListItem,
  AccordionListItem,
  ImageListItem
} from "../components/atoms/ListItem";
import getKey from "./getKey";
import { jobConfig } from "../configs/Jobs/jobDescription.json";

export const getList = list => {
  const listData = list;

  // listData = threshold
  //   ? listData.filter((listData, index) => index < threshold)
  //   : listData;
  const { ListTypeMap } = jobConfig;
  if (ListTypeMap[list.key]) {
    return (
      <ul>
        {listData.map(data => {
          switch (ListTypeMap[list.key].type) {
            case "IconListItem":
              return (
                <IconListItem
                  key={getKey()}
                  iconName={ListTypeMap[list.key].iconName}
                  description={data.description}
                />
              );
            case "ImageListItem":
              return (
                <ImageListItem
                  key={getKey()}
                  title={data.title}
                  description={data.description[0]}
                  imageUrl="https://upload.wikimedia.org/wikipedia/en/6/64/Zomato_logo_%28white-on-red%29.png"
                  size={50}
                />
              );
            case "AccordionListItem":
              return (
                <AccordionListItem
                  key={getKey()}
                  title={`Q. ${data.title}`}
                  description={`A. ${data.description}`}
                />
              );
            default:
              return <ListItem key={getKey()} description={data.description} />;
          }
        })}
      </ul>
    );
  }
};
