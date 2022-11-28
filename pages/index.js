import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Container from "components/container"
import Layout from 'components/layout';
import Hero from 'components/hero';
import Meta from 'components/meta';

import {getPlaiceholder } from 'plaiceholder';
import { eyecatchLocal } from 'lib/constants';
import { getAllPosts } from 'lib/api';
import Posts from 'components/posts';
import Pagination from 'components/pagination';

export default function Home({posts}) {
  return (
    <Container>
      <Meta/>
      <Hero 
        title="CUBE" 
        subtitle="アップと" 
        imageOn
      />
      <Posts posts={posts}/>
      <Pagination nextUrl="/blog" nextText='More Posts'/>
    </Container> 
  )
}

export async function getStaticProps(){
  const posts = await getAllPosts(4);

  for (const post of posts) {
    if (!post.hasOwnProperty('eyecatch')) {
      post.eyecatch = eyecatchLocal
    }
    const { base64 } = await getPlaiceholder(post.eyecatch.url)
    post.eyecatch.blurDataURL = base64
  }

  return {
    props:{
      posts:posts
    }
  }
}