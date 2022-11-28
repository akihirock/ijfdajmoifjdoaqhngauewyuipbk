import {getPostByslug,getAllSlugs} from 'lib/api';
import Container from 'components/container';
import PostHeader from 'components/post-header';
import Image from 'next/image';
import { TwoColumn,TwoColumnMain,TwoColumnSidebar } from 'components/two-column';
import PostBody from 'components/post-body';
import ConvertBody from 'components/convert-body';
import PostCategories from 'components/post-categories';
import { extractText } from 'lib/extract-text';
import Meta from 'components/meta';
import { eyecatchLocal } from 'lib/constants';
import { getPlaiceholder } from 'plaiceholder'
import { prevNextPost } from 'lib/prev-next-post';
import Pagination from 'components/pagination';

export default function Post({
  title,
  publish,
  content,
  eyecatch,
  categories,
  description,
  prevPost,
  nextPost
}){
  return(
    <Container>
      <Meta 
        pageTitle={title} 
        pageDesc={description}
        pageImg ={eyecatch.src}
        pageImgW={eyecatch.width}
        pageImgH={eyecatch.height}  
      />
      <article>
        <PostHeader title={title} subtitle="Blog Articlecle" publish={publish} />

        <figure>
          <Image
            key={eyecatch.url}
            src={eyecatch.url}
            alt=''
            layout='responsive'
            width={eyecatch.width}
            height={eyecatch.height}
            size="(min-width:1152px) 1152px, 100vw"
            priority
          />
        </figure>

        <TwoColumn>
            <TwoColumnMain>
              <PostBody><ConvertBody contentHTML={content}/></PostBody>
            </TwoColumnMain>
            <TwoColumnSidebar><PostCategories categories={categories}/></TwoColumnSidebar>
        </TwoColumn>

        <Pagination 
          prevText={prevPost.title}
          prevUrl={`/blog/${prevPost.slug}`}
          nextText={nextPost.title}
          nextUrl={`/blog/${nextPost.slug}`}
        />

      </article>
    </Container>
  ) 
}

// export async function getStaticPaths(){

//   const allSlugs = await getAllSlugs();
//   return{
//     paths: allSlugs.map(({slug})=>`/blog/${slug}`),
//     fallback:false
//   }
// }

export async function getServerSideProps(context){
//export async function getStaticProps(context){
  
  const slug = context.params.slug;

  const post = await getPostByslug(slug);

  if(!post){
    return {notFound: true}
  }else{
    const description = extractText(post.content);
    const eyecatch = post.eyecatch ?? eyecatchLocal;
    const { base64 } = await getPlaiceholder(eyecatch.url);
    eyecatch.blurDataURL = base64;

    const allSlugs = await getAllSlugs();
    const [prevPost,nextPost] = prevNextPost(allSlugs,slug);

    return{
      props:{
        title:post.title,
        publish:post.publishDate,
        content:post.content,
        eyecatch:eyecatch,
        categories:post.categories,
        description:description,
        prevPost:prevPost,
        nextPost:nextPost
      }
    }
    
  }


}

