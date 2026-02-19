import { useState } from 'react'
import { Button } from 'react-aria-components'
import { Info, ArrowRight, ChevronDown, Link } from 'lucide-react'
import {
  IconBrandLinkedin,
  IconBrandX,
  IconGlobe,
  IconChartDonut,
  IconBrandMeta,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react'


interface AppCardProps {
  title: string
  description?: string
  connections?: string[]
  combinedWithIcons?: React.ReactNode
  logoUrl: string
  logoAlt: string
  /** When set, renders instead of <img src={logoUrl} /> */
  logoNode?: React.ReactNode
  accentColor: string
  bgColor: string
  onOpen?: () => void
}

function AppCard({
  title,
  description,
  connections = [],
  combinedWithIcons,
  logoUrl,
  logoAlt,
  logoNode,
  accentColor,
  bgColor,
  onOpen,
}: AppCardProps) {
  return (
    <Button
      onPress={() => onOpen?.()}
      aria-label={title}
      className="rounded-xl pt-6 px-4 pb-4 flex flex-col min-h-[140px] relative transition-all duration-200 ease-out hover:-translate-y-2 hover:shadow-md cursor-pointer text-left border-0 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2"
      style={{
        border: '8px solid var(--surface-0)',
        background: bgColor,
        boxShadow: 'var(--elevation-shadow-s, none)',
      }}
    >
      <span
        className="absolute top-4 right-4 shrink-0 flex items-center justify-center"
        style={{ color: 'var(--copy-tertiary)' }}
        aria-hidden
      >
        <Info className="w-4 h-4" strokeWidth={2} />
      </span>
      {/* 1. Logo (sin texto), mínimo 60 de alto, ancho auto */}
      <div className="flex items-start pr-8">
        {logoNode != null ? (
          <span className="shrink-0 flex items-center" style={{ height: 30 }} aria-hidden>
            {logoNode}
          </span>
        ) : (
          <img
            src={logoUrl}
            alt={logoAlt}
            className="shrink-0 w-auto object-contain"
            style={{ minHeight: 30, height: 30 }}
          />
        )}
      </div>

      {/* 2. Combined: fondo black-100, sin borde */}
      {combinedWithIcons && (
        <div
          className="inline-flex items-center gap-1.5 flex-wrap mt-5 w-fit px-2.5 py-1.5"
          style={{ borderRadius: '8px', background: 'var(--color-black-100)' }}
          aria-hidden
        >
          {combinedWithIcons}
        </div>
      )}

      {description && (
        <p className="text-xs m-0 mt-3 leading-snug" style={{ color: 'var(--copy-secondary)' }}>
          {description}
        </p>
      )}

      {/* 3. Connections: chips solo fondo black-100, sin borde */}
      {connections.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold m-0 mb-1.5" style={{ color: 'var(--copy-primary)' }}>
            Connections:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {connections.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 text-xs font-normal"
                style={{
                  borderRadius: '8px',
                  background: 'var(--color-black-100)',
                  color: 'var(--copy-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* 4. Open a la izquierda, flecha pegada a la derecha */}
      <div className="mt-auto pt-4 flex justify-between items-center w-full" style={{ color: accentColor }}>
        <span className="text-sm font-medium">Open</span>
        <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
      </div>
    </Button>
  )
}

/** Titan Navbar logoMap: CDN base + byTheme filenames (Titan design system) */
const TITAN_LOGO_CDN_BASE = 'https://cdn.jsdelivr.net/gh/angelcreative/titan-foundations@main/public/assets/logos'

const ACTION_LOGO_SVG = (
  <svg width="96" height="28" viewBox="0 0 96 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-auto">
    <title>Action</title>
    <path d="M52.3799 16.8674H48.0848L47.3741 18.9223H45.103L48.9809 8.12271H51.4993L55.3772 18.9223H53.0906L52.3799 16.8674ZM51.7928 15.137L50.2324 10.6256L48.6719 15.137H51.7928ZM56.2706 14.6426C56.2706 13.7568 56.4508 12.9843 56.8113 12.3251C57.1718 11.6556 57.6714 11.1406 58.31 10.7801C58.9486 10.4093 59.6799 10.2239 60.5039 10.2239C61.5648 10.2239 62.4403 10.4917 63.1304 11.0273C63.8308 11.5526 64.2994 12.2942 64.5363 13.2521H62.2034C62.0798 12.8813 61.8686 12.5929 61.5699 12.3869C61.2815 12.1706 60.921 12.0625 60.4884 12.0625C59.8704 12.0625 59.3812 12.2891 59.0207 12.7423C58.6602 13.1852 58.4799 13.8186 58.4799 14.6426C58.4799 15.4563 58.6602 16.0898 59.0207 16.543C59.3812 16.9859 59.8704 17.2073 60.4884 17.2073C61.3639 17.2073 61.9356 16.8159 62.2034 16.0331H64.5363C64.2994 16.9601 63.8308 17.6966 63.1304 18.2425C62.43 18.7884 61.5545 19.0613 60.5039 19.0613C59.6799 19.0613 58.9486 18.8811 58.31 18.5206C57.6714 18.1498 57.1718 17.6348 56.8113 16.9756C56.4508 16.3061 56.2706 15.5284 56.2706 14.6426ZM68.6393 12.1397V16.2803C68.6393 16.5687 68.7062 16.7799 68.8401 16.9138C68.9843 17.0374 69.2212 17.0992 69.5508 17.0992H70.5551V18.9223H69.1955C67.3724 18.9223 66.4608 18.0365 66.4608 16.2649V12.1397H65.4411V10.363H66.4608V8.24631H68.6393V10.363H70.5551V12.1397H68.6393ZM73.2078 9.34326C72.8267 9.34326 72.5074 9.22481 72.2499 8.98791C72.0027 8.74071 71.8791 8.43686 71.8791 8.07636C71.8791 7.71586 72.0027 7.41716 72.2499 7.18026C72.5074 6.93306 72.8267 6.80946 73.2078 6.80946C73.5889 6.80946 73.903 6.93306 74.1502 7.18026C74.4077 7.41716 74.5365 7.71586 74.5365 8.07636C74.5365 8.43686 74.4077 8.74071 74.1502 8.98791C73.903 9.22481 73.5889 9.34326 73.2078 9.34326ZM74.2738 10.363V18.9223H72.1108V10.363H74.2738ZM80.2115 19.0613C79.3875 19.0613 78.6459 18.8811 77.9867 18.5206C77.3275 18.1498 76.8074 17.6296 76.4263 16.9601C76.0555 16.2906 75.8701 15.5181 75.8701 14.6426C75.8701 13.7671 76.0606 12.9946 76.4417 12.3251C76.8331 11.6556 77.3636 11.1406 78.0331 10.7801C78.7026 10.4093 79.4493 10.2239 80.2733 10.2239C81.0973 10.2239 81.8441 10.4093 82.5136 10.7801C83.1831 11.1406 83.7084 11.6556 84.0895 12.3251C84.4809 12.9946 84.6766 13.7671 84.6766 14.6426C84.6766 15.5181 84.4757 16.2906 84.074 16.9601C83.6826 17.6296 83.147 18.1498 82.4672 18.5206C81.7977 18.8811 81.0458 19.0613 80.2115 19.0613ZM80.2115 17.1764C80.6029 17.1764 80.9686 17.0837 81.3085 16.8983C81.6587 16.7026 81.9368 16.4142 82.1428 16.0331C82.3488 15.652 82.4518 15.1885 82.4518 14.6426C82.4518 13.8289 82.2355 13.2058 81.8029 12.7732C81.3806 12.3303 80.8604 12.1088 80.2424 12.1088C79.6244 12.1088 79.1043 12.3303 78.682 12.7732C78.27 13.2058 78.064 13.8289 78.064 14.6426C78.064 15.4563 78.2648 16.0846 78.6665 16.5275C79.0785 16.9601 79.5935 17.1764 80.2115 17.1764ZM91.0064 10.2394C92.0261 10.2394 92.8501 10.5638 93.4784 11.2127C94.1067 11.8513 94.4208 12.7474 94.4208 13.901V18.9223H92.2578V14.1946C92.2578 13.5148 92.0879 12.9946 91.748 12.6341C91.4081 12.2633 90.9446 12.0779 90.3575 12.0779C89.7601 12.0779 89.2863 12.2633 88.9361 12.6341C88.5962 12.9946 88.4262 13.5148 88.4262 14.1946V18.9223H86.2632V10.363H88.4262V11.429C88.7146 11.0582 89.0803 10.7698 89.5232 10.5638C89.9764 10.3475 90.4708 10.2394 91.0064 10.2394Z" fill="#F74F25" />
    <path d="M0 9.33427C0 4.19024 8.32267 0 18.5551 0C28.7876 0 36.9203 4.09611 37.1009 9.16324V18.7311C36.9188 13.6625 28.6677 9.56798 18.5551 9.56798C8.44246 9.56798 0 13.7566 0 18.9021V9.33427Z" fill="#F74F25" />
    <path d="M35.2467 12.8906C35.5503 12.5345 35.8087 12.1642 36.0204 11.7814V21.35C35.8087 21.7282 35.5518 22.0984 35.2467 22.4593V12.8906Z" fill="#F74F25" />
    <path d="M32.7215 15.0195C33.1994 14.7183 33.6383 14.4029 34.0384 14.0766V23.6405C33.6368 23.9684 33.1978 24.2869 32.7215 24.5834V15.0148" fill="#F74F25" />
    <path d="M29.1749 16.7228C29.7913 16.4984 30.3828 16.2506 30.9354 15.9917V25.5556C30.3781 25.8192 29.7913 26.0608 29.1749 26.2867V16.7181" fill="#F74F25" />
    <path d="M24.8161 17.8949C25.5462 17.7584 26.2513 17.6016 26.9316 17.4227V26.9867C26.2513 27.1655 25.5415 27.3271 24.8161 27.4589V17.8903" fill="#F74F25" />
    <path d="M14.6871 18.2482C15.4592 18.3328 16.25 18.3925 17.0516 18.427V27.9909C16.2453 27.9565 15.4561 27.8968 14.6871 27.8121V18.2434" fill="#F74F25" />
    <path d="M19.8516 18.4314C20.6579 18.4016 21.4518 18.3467 22.2254 18.2651V27.8337C21.4533 27.9137 20.6595 27.9703 19.8516 28V18.4314Z" fill="#F74F25" />
    <path d="M10.0029 17.3772C10.6785 17.5592 11.3837 17.7208 12.1106 17.862V27.4259C11.3837 27.2863 10.6832 27.1247 10.0029 26.9411V17.3725" fill="#F74F25" />
    <path d="M6.02969 15.9245C6.58229 16.1881 7.16599 16.4392 7.77779 16.6682V26.2321C7.16599 26.0031 6.57919 25.7568 6.02969 25.4885V15.9199" fill="#F74F25" />
    <path d="M2.96845 13.9899C3.36072 14.321 3.79657 14.6394 4.26516 14.9422V24.5108C3.79657 24.2096 3.36072 23.8912 2.96845 23.5585V13.9899Z" fill="#F74F25" />
    <path d="M1.03311 11.6891C1.23547 12.072 1.48453 12.4407 1.78029 12.803V22.3717C1.48453 22.0109 1.23547 21.6406 1.03311 21.2578V11.6891Z" fill="#F74F25" />
  </svg>
)

const SOPRISM_LOGO_SVG = (
  <svg width="109" height="28" viewBox="0 0 109 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-auto">
    <title>Soprism</title>
    <path d="M0.679688 9.2619C0.679688 4.1577 9.00299 0 19.2362 0C29.4694 0 37.6028 4.0643 37.7834 9.0922V18.5861C37.6012 13.5566 29.3496 9.4938 19.2362 9.4938C9.12279 9.4938 0.679688 13.65 0.679688 18.7558V9.2619Z" fill="#EC672C" />
    <path d="M35.9287 12.791C36.2323 12.4376 36.4907 12.0703 36.7024 11.6904V21.1843C36.4907 21.5594 36.2338 21.9268 35.9287 22.2848V12.791Z" fill="#EC672C" />
    <path d="M33.4043 14.9033C33.8822 14.6044 34.3211 14.2916 34.7212 13.9678V23.457C34.3196 23.7823 33.8806 24.0983 33.4043 24.3925V14.8986" fill="#EC672C" />
    <path d="M29.8564 16.5936C30.4729 16.371 31.0644 16.1251 31.617 15.8682V25.3574C31.0597 25.6189 30.4729 25.8586 29.8564 26.0828V16.5889" fill="#EC672C" />
    <path d="M25.498 17.7566C26.2281 17.6212 26.9332 17.4655 27.6134 17.2881V26.7772C26.9332 26.9547 26.2234 27.115 25.498 27.2458V17.7519" fill="#EC672C" />
    <path d="M15.3672 18.1062C16.1393 18.1903 16.93 18.2494 17.7317 18.2837V27.7729C16.9254 27.7386 16.1362 27.6795 15.3672 27.5954V18.1016" fill="#EC672C" />
    <path d="M20.5322 18.289C21.3385 18.2594 22.1324 18.2049 22.906 18.124V27.6178C22.1339 27.6972 21.3401 27.7532 20.5322 27.7828V18.289Z" fill="#EC672C" />
    <path d="M10.6836 17.243C11.3592 17.4236 12.0643 17.5839 12.7913 17.724V27.2132C12.0643 27.0746 11.3639 26.9143 10.6836 26.7322V17.2383" fill="#EC672C" />
    <path d="M6.70996 15.8016C7.26256 16.0631 7.84626 16.3122 8.45796 16.5394V26.0286C7.84626 25.8013 7.25936 25.5569 6.70996 25.2908V15.7969" fill="#EC672C" />
    <path d="M3.64746 13.8818C4.03973 14.2102 4.47558 14.5262 4.94408 14.8266V24.3205C4.47558 24.0216 4.03973 23.7056 3.64746 23.3756V13.8818Z" fill="#EC672C" />
    <path d="M1.71289 11.5986C1.91525 11.9784 2.16431 12.3442 2.46007 12.7038V22.1976C2.16431 21.8396 1.91525 21.4723 1.71289 21.0924V11.5986Z" fill="#EC672C" />
    <path d="M49.7499 19.1084C48.9981 19.1084 48.3184 18.9797 47.7108 18.7222C47.1136 18.4648 46.6398 18.0941 46.2897 17.61C45.9396 17.126 45.7593 16.5545 45.749 15.8954H48.0661C48.097 16.3382 48.2515 16.6884 48.5296 16.9458C48.8179 17.2033 49.2092 17.332 49.7036 17.332C50.2082 17.332 50.6046 17.2136 50.893 16.9767C51.1813 16.7295 51.3255 16.4103 51.3255 16.019C51.3255 15.6997 51.2277 15.4371 51.032 15.2312C50.8364 15.0252 50.5892 14.8656 50.2905 14.7523C50.0022 14.6287 49.6006 14.4948 49.0857 14.3507C48.3854 14.1447 47.8138 13.9439 47.371 13.7482C46.9385 13.5422 46.5626 13.2385 46.2434 12.8368C45.9344 12.4249 45.7799 11.8791 45.7799 11.1994C45.7799 10.5609 45.9396 10.0048 46.2588 9.53114C46.578 9.05744 47.026 8.69694 47.6027 8.44984C48.1794 8.19234 48.8385 8.06364 49.58 8.06364C50.6922 8.06364 51.5933 8.33654 52.2833 8.88234C52.9835 9.41784 53.3697 10.1696 53.4418 11.1376H51.0629C51.0423 10.7669 50.8827 10.4631 50.584 10.2262C50.2957 9.97914 49.9095 9.85554 49.4255 9.85554C49.0033 9.85554 48.6634 9.96364 48.406 10.1799C48.1588 10.3961 48.0352 10.7102 48.0352 11.1222C48.0352 11.4105 48.1279 11.6525 48.3133 11.8482C48.509 12.0336 48.7458 12.188 49.0239 12.3116C49.3122 12.4249 49.7138 12.5588 50.2288 12.7132C50.929 12.9192 51.5006 13.1252 51.9434 13.3311C52.3862 13.5371 52.7673 13.846 53.0865 14.258C53.4058 14.6699 53.5654 15.2106 53.5654 15.8799C53.5654 16.4566 53.4161 16.9921 53.1174 17.4865C52.8188 17.9808 52.3811 18.3773 51.8044 18.6759C51.2277 18.9643 50.5429 19.1084 49.7499 19.1084ZM59.2403 19.1393C58.4165 19.1393 57.675 18.9591 57.0159 18.5987C56.3568 18.2279 55.8368 17.7079 55.4557 17.0385C55.085 16.3691 54.8996 15.5967 54.8996 14.7214C54.8996 13.846 55.0902 13.0737 55.4712 12.4043C55.8625 11.7349 56.3929 11.22 57.0623 10.8596C57.7316 10.4888 58.4783 10.3035 59.3021 10.3035C60.126 10.3035 60.8726 10.4888 61.542 10.8596C62.2114 11.22 62.7366 11.7349 63.1176 12.4043C63.5089 13.0737 63.7046 13.846 63.7046 14.7214C63.7046 15.5967 63.5038 16.3691 63.1022 17.0385C62.7108 17.7079 62.1753 18.2279 61.4956 18.5987C60.8263 18.9591 60.0745 19.1393 59.2403 19.1393ZM59.2403 17.2548C59.6317 17.2548 59.9973 17.1621 60.3371 16.9767C60.6872 16.781 60.9653 16.4927 61.1712 16.1117C61.3772 15.7306 61.4802 15.2672 61.4802 14.7214C61.4802 13.9078 61.2639 13.2848 60.8314 12.8523C60.4092 12.4094 59.8891 12.188 59.2712 12.188C58.6533 12.188 58.1333 12.4094 57.7111 12.8523C57.2991 13.2848 57.0932 13.9078 57.0932 14.7214C57.0932 15.535 57.294 16.1631 57.6956 16.606C58.1075 17.0385 58.6224 17.2548 59.2403 17.2548ZM67.4536 11.6783C67.7317 11.2869 68.1127 10.9625 68.5967 10.7051C69.091 10.4373 69.6523 10.3035 70.2805 10.3035C71.0116 10.3035 71.6707 10.4837 72.2577 10.8441C72.855 11.2046 73.3236 11.7195 73.6634 12.3888C74.0136 13.0479 74.1886 13.8152 74.1886 14.6905C74.1886 15.5658 74.0136 16.3434 73.6634 17.023C73.3236 17.6924 72.855 18.2125 72.2577 18.5832C71.6707 18.954 71.0116 19.1393 70.2805 19.1393C69.6523 19.1393 69.0962 19.0106 68.6121 18.7531C68.1384 18.4957 67.7522 18.1713 67.4536 17.78V23.0784H65.291V10.4425H67.4536V11.6783ZM71.9797 14.6905C71.9797 14.1756 71.8715 13.7328 71.6553 13.362C71.4493 12.981 71.1713 12.6926 70.8211 12.497C70.4813 12.3013 70.1105 12.2035 69.7089 12.2035C69.3176 12.2035 68.9468 12.3065 68.5967 12.5124C68.2569 12.7081 67.9788 12.9964 67.7625 13.3775C67.5566 13.7585 67.4536 14.2065 67.4536 14.7214C67.4536 15.2363 67.5566 15.6843 67.7625 16.0653C67.9788 16.4463 68.2569 16.7398 68.5967 16.9458C68.9468 17.1415 69.3176 17.2393 69.7089 17.2393C70.1105 17.2393 70.4813 17.1363 70.8211 16.9304C71.1713 16.7244 71.4493 16.4309 71.6553 16.0499C71.8715 15.6688 71.9797 15.2157 71.9797 14.6905ZM77.9228 11.771C78.2008 11.3178 78.5613 10.9625 79.0041 10.7051C79.4572 10.4476 79.9721 10.3189 80.5488 10.3189V12.5897H79.9773C79.2976 12.5897 78.7827 12.7493 78.4325 13.0685C78.0927 13.3878 77.9228 13.9439 77.9228 14.7368V19.0003H75.7601V10.4425H77.9228V11.771ZM83.1022 9.42304C82.7212 9.42304 82.4019 9.30454 82.1445 9.06774C81.8973 8.82054 81.7737 8.51674 81.7737 8.15634C81.7737 7.79584 81.8973 7.49724 82.1445 7.26034C82.4019 7.01324 82.7212 6.88965 83.1022 6.88965C83.4832 6.88965 83.7973 7.01324 84.0445 7.26034C84.302 7.49724 84.4307 7.79584 84.4307 8.15634C84.4307 8.51674 84.302 8.82054 84.0445 9.06774C83.7973 9.30454 83.4832 9.42304 83.1022 9.42304ZM84.1681 10.4425V19.0003H82.0054V10.4425H84.1681ZM89.5796 19.1393C88.8793 19.1393 88.2511 19.0157 87.695 18.7686C87.1389 18.5111 86.6961 18.1661 86.3665 17.7336C86.0473 17.3011 85.8722 16.8222 85.8413 16.297H88.0194C88.0606 16.6266 88.2202 16.8995 88.4983 17.1157C88.7866 17.332 89.1419 17.4401 89.5641 17.4401C89.9761 17.4401 90.2953 17.3577 90.5219 17.193C90.7587 17.0282 90.8772 16.8171 90.8772 16.5596C90.8772 16.2816 90.733 16.0756 90.4446 15.9417C90.1666 15.7976 89.7186 15.6431 89.1007 15.4783C88.4622 15.3238 87.937 15.1642 87.5251 14.9994C87.1235 14.8347 86.7733 14.5824 86.4747 14.2425C86.1863 13.9027 86.0421 13.4444 86.0421 12.8677C86.0421 12.394 86.176 11.9615 86.4438 11.5701C86.7218 11.1788 87.1132 10.8699 87.6178 10.6433C88.1327 10.4167 88.7351 10.3035 89.4251 10.3035C90.4446 10.3035 91.2582 10.5609 91.8658 11.0758C92.4734 11.5804 92.8081 12.2653 92.8699 13.1303H90.7999C90.769 12.7905 90.6248 12.5227 90.3674 12.3271C90.1202 12.1211 89.7855 12.0181 89.3633 12.0181C88.972 12.0181 88.6682 12.0902 88.4519 12.2344C88.246 12.3786 88.143 12.5794 88.143 12.8368C88.143 13.1252 88.2872 13.3466 88.5755 13.5011C88.8639 13.6452 89.3118 13.7946 89.9194 13.949C90.5373 14.1035 91.0471 14.2631 91.4487 14.4279C91.8503 14.5927 92.1953 14.8501 92.4837 15.2003C92.7823 15.5401 92.9368 15.9932 92.9471 16.5596C92.9471 17.0539 92.8081 17.4968 92.53 17.8881C92.2623 18.2794 91.8709 18.5884 91.356 18.8149C90.8514 19.0312 90.2593 19.1393 89.5796 19.1393ZM105.35 10.3189C106.401 10.3189 107.245 10.6433 107.884 11.2921C108.532 11.9306 108.857 12.8265 108.857 13.9799V19.0003H106.694V14.2734C106.694 13.604 106.524 13.0943 106.184 12.7441C105.845 12.3837 105.381 12.2035 104.794 12.2035C104.207 12.2035 103.739 12.3837 103.388 12.7441C103.049 13.0943 102.879 13.604 102.879 14.2734V19.0003H100.716V14.2734C100.716 13.604 100.546 13.0943 100.206 12.7441C99.8658 12.3837 99.4028 12.2035 98.8158 12.2035C98.2188 12.2035 97.7448 12.3837 97.3948 12.7441C97.0548 13.0943 96.8848 13.604 96.8848 14.2734V19.0003H94.7223V10.4425H96.8848V11.4775C97.1628 11.117 97.5178 10.8338 97.9508 10.6279C98.3938 10.4219 98.8778 10.3189 99.4028 10.3189C100.072 10.3189 100.67 10.4631 101.195 10.7514C101.72 11.0295 102.127 11.4311 102.415 11.9563C102.693 11.462 103.095 11.0655 103.62 10.7669C104.156 10.4682 104.732 10.3189 105.35 10.3189Z" fill="#EC672C" />
  </svg>
)

const MY_APPS: Omit<AppCardProps, 'onOpen'>[] = [
  {
    title: 'Action',
    description: 'Generate audience insights and turn them into ready-to-use campaign ideas',
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-audiense.svg`,
    logoAlt: 'Audiense',
    logoNode: ACTION_LOGO_SVG,
    accentColor: 'var(--color-pomegranate-600, #c53030)',
    bgColor: 'var(--color-pomegranate-100, #fde8e8)',
  },
  {
    title: 'Insights',
    combinedWithIcons: (
      <>
        <IconBrandX className="w-4 h-4 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
        <span className="text-xs" style={{ color: 'var(--copy-tertiary)' }}>combined with</span>
        <IconGlobe className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
        <IconChartDonut className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
        <IconBrandMeta className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
        <IconBrandLinkedin className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
      </>
    ),
    connections: ['#MCP', 'Meltwater', 'Pulsar', 'Talkwalker', 'GWI', 'Kantar'],
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-insights.svg`,
    logoAlt: 'Insights',
    accentColor: 'var(--color-violet-600, #7c3aed)',
    bgColor: 'var(--color-violet-100, #f5f3ff)',
  },
  {
    title: 'Digital Intelligence for LinkedIn',
    connections: ['#MCP', 'LinkedIn Saved Audiences'],
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-inkedin.svg`,
    logoAlt: 'LinkedIn',
    accentColor: 'var(--color-indigo-600, #4f46e5)',
    bgColor: 'var(--color-indigo-100, #eef2ff)',
  },
  {
    title: 'Demand',
    combinedWithIcons: (
      <>
        <IconBrandX className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
        <IconBrandLinkedin className="w-4 h-4" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
      </>
    ),
    connections: ['#MCP'],
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-demand.svg`,
    logoAlt: 'Demand',
    accentColor: 'var(--color-aquamarine-600, #0d9488)',
    bgColor: 'var(--color-aquamarine-100, #e6fffa)',
  },
  {
    title: 'Connect',
    combinedWithIcons: <IconBrandX className="w-5 h-5" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />,
    connections: ['X Ads'],
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-tweetbinder.svg`,
    logoAlt: 'Connect',
    accentColor: 'var(--color-ocean-600, #0369a1)',
    bgColor: 'var(--color-ocean-100, #e0f2fe)',
  },
  {
    title: 'Tweet Binder',
    combinedWithIcons: <IconBrandX className="w-5 h-5" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />,
    connections: ['#MCP'],
    logoUrl: `${TITAN_LOGO_CDN_BASE}/logo-tweetbinder.svg`,
    logoAlt: 'Tweet Binder',
    accentColor: 'var(--color-ocean-600, #0369a1)',
    bgColor: 'var(--color-ocean-100, #e0f2fe)',
  },
]

interface CreatorDiscoveryHomeProps {
  onFindCreators?: () => void
}

export function CreatorDiscoveryHome({ onFindCreators }: CreatorDiscoveryHomeProps) {
  const [otherAppsOpen, setOtherAppsOpen] = useState(false)

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-auto w-full" style={{ background: 'var(--surface-page)' }}>
      <div
        className="flex-shrink-0 px-6 pt-6 pb-4"
        style={{ background: 'var(--surface-page)' }}
      >
        <h1 className="text-2xl font-bold m-0" style={{ color: 'var(--copy-primary)' }}>
          Know your audience
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 min-w-0" style={{ background: 'var(--surface-page)' }}>
        <section className="mb-8">
          <h2 className="text-lg font-semibold m-0 mb-4" style={{ color: 'var(--copy-primary)' }}>
            My apps
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            style={{ gap: 'var(--spacing-m)' }}
          >
            {MY_APPS.map((app, i) => (
              <AppCard
                key={app.title}
                {...app}
                onOpen={i === 4 ? onFindCreators : undefined}
              />
            ))}
          </div>
        </section>

        <section>
          <button
            type="button"
            onClick={() => setOtherAppsOpen((o) => !o)}
            className="flex items-center gap-2 w-full text-left border-0 bg-transparent cursor-pointer py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 rounded"
            style={{ color: 'var(--copy-primary)' }}
            aria-expanded={otherAppsOpen}
          >
            <h2 className="text-lg font-semibold m-0" style={{ color: 'var(--copy-primary)' }}>
              Other available apps
            </h2>
            <span
              className="shrink-0 transition-transform"
              style={{
                transform: otherAppsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                color: 'var(--copy-tertiary)',
              }}
              aria-hidden
            >
              <ChevronDown className="w-5 h-5" strokeWidth={2} />
            </span>
          </button>
          {otherAppsOpen && (
            <div className="pt-2 pb-4 flex flex-col gap-4">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
                style={{ gap: 'var(--spacing-m)' }}
              >
                <AppCard
                  key="Soprism"
                  title="Soprism"
                  description="Identify top personas including of first-party segments"
                  logoUrl=""
                  logoAlt="Soprism"
                  logoNode={SOPRISM_LOGO_SVG}
                  combinedWithIcons={
                    <>
                      <IconBrandFacebook className="w-4 h-4 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      <IconBrandInstagram className="w-4 h-4 shrink-0" style={{ color: 'var(--copy-tertiary)' }} aria-hidden />
                      <Link className="w-4 h-4 shrink-0" style={{ color: 'var(--copy-tertiary)' }} strokeWidth={1.5} aria-hidden />
                    </>
                  }
                  connections={['MCP', 'Elevar', 'Meta Custom Audiences']}
                  accentColor="var(--color-pomegranate-600, #c53030)"
                  bgColor="var(--color-pomegranate-100, #fde8e8)"
                />
              </div>
              <p className="text-sm m-0" style={{ color: 'var(--copy-tertiary)' }}>
                More apps will appear here when available.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
