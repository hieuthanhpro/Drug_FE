import React, { useState } from "react";
import Fancybox from "components/fancybox/fancybox";
import ImageFake from "assets/images/video.png";
import Icon from "components/icon";
import { IVideoHelp } from "model/dashboard/response/DashboardModelResponse";
import { DasboardBlockProps } from "model/dashboard/PropsModel";

export default function VideoHelp(props: DasboardBlockProps) {
  const { classNames } = props;

  const [videos] = useState<IVideoHelp[]>([
    {
      title: "SPHACY GPP - Hướng dẫn sử dụng chức năng Bán hàng theo sản phẩm bán lẻ",
      image: ImageFake,
      url: "https://www.youtube.com/embed/LHLbQiJ5J5M",
    },
    {
      title: "SPHACY GPP - Hướng dẫn sử dụng chức năng Bán hàng theo sản phẩm bán lẻ",
      image: ImageFake,
      url: "https://www.youtube.com/embed/a412743kT-8",
    },
  ]);

  return (
    <div className={`card-box video-help${classNames ? ` ${classNames}` : ""}`}>
      <div className="title d-flex align-items-start justify-content-between">
        <h2>Hướng dẫn sử dụng</h2>
      </div>
      <div className="video-help__list d-flex justify-content-between">
        <Fancybox>
          <ul>
            {videos.map((v, index) => (
              <li key={index}>
                <a data-fancybox="video" href={v.url}>
                  <span className="video-help--image">
                    <img src={v.image} alt={v.title} />
                    <span className="icon-play">
                      <Icon name="Play" />
                    </span>
                  </span>
                  <span className="video-help--title">{v.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </Fancybox>
      </div>
    </div>
  );
}
