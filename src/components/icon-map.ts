/**
 * Registre d'icônes — SVG Lucide intégrés à la compilation.
 * Aucune bibliothèque d'icônes n'est envoyée au navigateur.
 */
import phone from "lucide-static/icons/phone.svg?raw";
import phoneCall from "lucide-static/icons/phone-call.svg?raw";
import mail from "lucide-static/icons/mail.svg?raw";
import mapPin from "lucide-static/icons/map-pin.svg?raw";
import clock from "lucide-static/icons/clock.svg?raw";
import calendar from "lucide-static/icons/calendar.svg?raw";
import calendarCheck from "lucide-static/icons/calendar-check.svg?raw";
import arrowRight from "lucide-static/icons/arrow-right.svg?raw";
import arrowUpRight from "lucide-static/icons/arrow-up-right.svg?raw";
import arrowDown from "lucide-static/icons/arrow-down.svg?raw";
import chevronDown from "lucide-static/icons/chevron-down.svg?raw";
import check from "lucide-static/icons/check.svg?raw";
import circleCheck from "lucide-static/icons/circle-check.svg?raw";
import circleAlert from "lucide-static/icons/circle-alert.svg?raw";
import info from "lucide-static/icons/info.svg?raw";
import leaf from "lucide-static/icons/leaf.svg?raw";
import sprout from "lucide-static/icons/sprout.svg?raw";
import shrub from "lucide-static/icons/shrub.svg?raw";
import sun from "lucide-static/icons/sun.svg?raw";
import sunrise from "lucide-static/icons/sunrise.svg?raw";
import cloud from "lucide-static/icons/cloud.svg?raw";
import rainbow from "lucide-static/icons/rainbow.svg?raw";
import sparkles from "lucide-static/icons/sparkles.svg?raw";
import star from "lucide-static/icons/star.svg?raw";
import flower from "lucide-static/icons/flower.svg?raw";
import palette from "lucide-static/icons/palette.svg?raw";
import paintbrush from "lucide-static/icons/paintbrush.svg?raw";
import scissors from "lucide-static/icons/scissors.svg?raw";
import music from "lucide-static/icons/music.svg?raw";
import recycle from "lucide-static/icons/recycle.svg?raw";
import footprints from "lucide-static/icons/footprints.svg?raw";
import handHeart from "lucide-static/icons/hand-heart.svg?raw";
import heartHandshake from "lucide-static/icons/heart-handshake.svg?raw";
import heart from "lucide-static/icons/heart.svg?raw";
import compass from "lucide-static/icons/compass.svg?raw";
import bookOpen from "lucide-static/icons/book-open.svg?raw";
import notebookPen from "lucide-static/icons/notebook-pen.svg?raw";
import blocks from "lucide-static/icons/blocks.svg?raw";
import puzzle from "lucide-static/icons/puzzle.svg?raw";
import baby from "lucide-static/icons/baby.svg?raw";
import backpack from "lucide-static/icons/backpack.svg?raw";
import graduationCap from "lucide-static/icons/graduation-cap.svg?raw";
import school from "lucide-static/icons/school.svg?raw";
import users from "lucide-static/icons/users.svg?raw";
import shieldCheck from "lucide-static/icons/shield-check.svg?raw";
import droplets from "lucide-static/icons/droplets.svg?raw";
import utensils from "lucide-static/icons/utensils.svg?raw";
import apple from "lucide-static/icons/apple.svg?raw";
import moon from "lucide-static/icons/moon.svg?raw";
import home from "lucide-static/icons/home.svg?raw";
import image from "lucide-static/icons/image.svg?raw";
import balloon from "lucide-static/icons/balloon.svg?raw";
import partyPopper from "lucide-static/icons/party-popper.svg?raw";
import send from "lucide-static/icons/send.svg?raw";
import externalLink from "lucide-static/icons/external-link.svg?raw";
import download from "lucide-static/icons/download.svg?raw";
import messageCircle from "lucide-static/icons/message-circle.svg?raw";
import menu from "lucide-static/icons/menu.svg?raw";
import x from "lucide-static/icons/x.svg?raw";

export const ICONS = {
  phone,
  "phone-call": phoneCall,
  mail,
  "map-pin": mapPin,
  clock,
  calendar,
  "calendar-check": calendarCheck,
  "arrow-right": arrowRight,
  "arrow-up-right": arrowUpRight,
  "arrow-down": arrowDown,
  "chevron-down": chevronDown,
  check,
  "circle-check": circleCheck,
  "circle-alert": circleAlert,
  info,
  leaf,
  sprout,
  shrub,
  sun,
  sunrise,
  cloud,
  rainbow,
  sparkles,
  star,
  flower,
  palette,
  paintbrush,
  scissors,
  music,
  recycle,
  footprints,
  "hand-heart": handHeart,
  "heart-handshake": heartHandshake,
  heart,
  compass,
  "book-open": bookOpen,
  "notebook-pen": notebookPen,
  blocks,
  puzzle,
  baby,
  backpack,
  "graduation-cap": graduationCap,
  school,
  users,
  "shield-check": shieldCheck,
  droplets,
  utensils,
  apple,
  moon,
  home,
  image,
  balloon,
  "party-popper": partyPopper,
  send,
  "external-link": externalLink,
  download,
  "message-circle": messageCircle,
  menu,
  x,
} as const;

export type IconName = keyof typeof ICONS;
