"use client";
import FashionOneForm from "@/components/homePages/fashionOne";
import GameHomePageForm from "@/components/homePages/gameHomePage";
import request from "@/utils/axiosUtils";
import { BrandAPI, Category, attribute, blog } from "@/utils/axiosUtils/API";
import { titleCreate } from "@/utils/customFunctions/TitleCreate";
import useCustomQuery from "@/utils/hooks/useCustomQuery";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const homePages = () => {
  const params = useParams()
  const [title, setTitle] = useState("");
  const { data: blogData } = useCustomQuery([blog], () => request({ url: blog }), {
    refetchOnWindowFocus: false,
    select: (res) =>
      res?.data?.data.map((elem) => {
        return { id: elem.id, name: elem.title, slug: elem?.slug };
      }),
  });
  const { data: brandData, isLoading: brandLoader } = useCustomQuery([BrandAPI], () => request({ url: BrandAPI }), {
    refetchOnWindowFocus: false,
    select: (res) =>
      res?.data?.data.map((elem) => {
        return { id: elem.id, name: elem.name };
      }),
  });

  const { data: attributeData } = useCustomQuery([attribute], () => request({ url: attribute }), {
    refetchOnWindowFocus: false,
    select: (res) =>
      res?.data?.data.map((elem) => {
        return { id: elem.id, name: elem.name };
      }),
  });

  const {
    data: categoryData,
    isLoading: categoryLoader,
    refetch: categoryRefetch,
  } = useCustomQuery([Category], () => request({ url: Category, params: { type: "product" } }), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: (res) =>
      res?.data?.data?.map((elem) => {
        return { subcategories: elem.subcategories, id: elem.id, name: elem.name, image: elem?.category_icon?.original_url || "/assets/images/placeholder.png", slug: elem?.slug };
      }),
  });

  const apiData = {
    categoryData: categoryData,
    categoryLoader: categoryLoader,
    categoryRefetch: categoryRefetch,
    brandData: brandData,
    brandLoader: brandLoader,
    blogData: blogData,
    attributeData: attributeData,
  };

  useEffect(() => {
    titleCreate(params.slug, setTitle);
  }, [params]);

  const homePageOptions = {
    fashion_one: <FashionOneForm title={title} apiData={apiData} />,
    game: <GameHomePageForm title={title} apiData={apiData} />,
  };

  return <>{homePageOptions[params.slug]}</>;
};

export default homePages;
