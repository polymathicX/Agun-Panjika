"""Build the editable PowerPoint companion to the seven-slide PDF."""
from __future__ import annotations

import re
import shutil
import unicodedata
from datetime import UTC, datetime
from pathlib import Path

import pymupdf
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE, MSO_CONNECTOR
from pptx.enum.text import MSO_AUTO_SIZE
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Mm, Pt

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'docs/pptx/GLOBAL_DEMO_SLIDES.pptx'
INK, EMBER, PAPER, BLUE, MUTED = '173047', 'B84127', 'F6F5EF', 'E8F0F2', '536575'


def text(slide, x, y, width, value, size=22, leading=None, bold=False, color=INK, font='Calibri', height=None, link=None):
    box = slide.shapes.add_textbox(Mm(x), Mm(y), Mm(width), Mm(height if height is not None else 174-y))
    frame = box.text_frame
    frame.clear()
    frame.word_wrap = True
    frame.auto_size = MSO_AUTO_SIZE.NONE
    frame.margin_left = frame.margin_right = frame.margin_top = frame.margin_bottom = 0
    for i, line in enumerate(value.split('\n')):
        paragraph = frame.paragraphs[0] if i == 0 else frame.add_paragraph()
        paragraph.space_before = paragraph.space_after = Pt(0)
        paragraph.line_spacing = Pt(leading or size*1.22)
        run = paragraph.add_run()
        run.text = line
        run.font.name, run.font.size, run.font.bold = font, Pt(size), bold
        run.font.color.rgb = RGBColor.from_string(color)
        if link:
            run.hyperlink.address = link
    return box


def picture(slide, x, y, width, height, name):
    path = ROOT / name
    with Image.open(path) as image:
        iw, ih = image.size
    scale = min(width/iw, height/ih)
    slide.shapes.add_picture(str(path), Mm(x), Mm(y), width=Mm(iw*scale), height=Mm(ih*scale))


def rectangle(slide, x, y, width, height, color, border=None):
    shape = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, Mm(x), Mm(y), Mm(width), Mm(height))
    shape.fill.solid()
    shape._element.spPr.append(OxmlElement('a:effectLst'))
    shape.fill.fore_color.rgb = RGBColor.from_string(color)
    if border:
        shape.line.color.rgb = RGBColor.from_string(border)
        shape.line.width = Pt(.65)
    else:
        shape.line.fill.background()
    return shape


def footer(slide, value, number, dark=False, link=None):
    color = 'C5CBD1' if dark else MUTED
    text(slide,18,178,275,value,10,12,color=color,height=8,link=link)
    text(slide,309,177,15,f'{number} / 7',12,14,color='FFFFFF' if dark else INK,height=8)


def heading(slide, kicker, title, y=32, size=35):
    text(slide,18,15,300,kicker,12,15,True,EMBER,height=10)
    text(slide,18,y,305,title,size,size*1.2,True,font='Cambria',height=40)


def main():
    pdf = pymupdf.open(ROOT/'docs/pdf/GLOBAL_DEMO_SLIDES.pdf')
    assert len(pdf) == 7
    deck = Presentation()
    deck.slide_width, deck.slide_height = Mm(338.67), Mm(190.5)
    deck.core_properties.title = "Agun Panjika: know your country's fire story"
    deck.core_properties.author = 'Team KUETaguns'
    deck.core_properties.last_modified_by = 'Team KUETaguns'
    deck.core_properties.created = deck.core_properties.modified = datetime.now(UTC)
    deck.core_properties.subject = 'Harmonization of MODIS and VIIRS Hot Spots'
    deck.core_properties.comments = 'Editable text and diagrams; actual app screenshots and seasonal figure. AI-assisted development and editorial work.'
    def slide(dark=False):
        s = deck.slides.add_slide(deck.slide_layouts[6])
        s.background.fill.solid()
        s.background.fill.fore_color.rgb = RGBColor.from_string(INK if dark else PAPER)
        return s
    shots = 'docs/review/screenshots/'

    s = slide()
    heading(s,'TEAM KUETaguns    NASA SPACE APPS 2026','Agun Panjika',43,47)
    text(s,18,78,148,"Know your country's\nfire story.",29,35)
    line=s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,Mm(18),Mm(117),Mm(41),Mm(117))
    line.line.color.rgb=RGBColor.from_string(EMBER);line.line.width=Pt(2)
    text(s,18,127,142,'Explore NASA observations.\nUnderstand the season.\nShare what you find.',20,26)
    picture(s,184,30,141,139,shots+'earth-close.png')
    footer(s,'Harmonization of MODIS and VIIRS Hot Spots  •  An independent Space Apps team project',1)

    s = slide()
    heading(s,'WHY THIS MATTERS','One landscape. Different views.')
    for offset,cells,step in [(22,3,26),(132,8,9.75)]:
        for row in range(cells):
            for column in range(cells):
                rectangle(s,offset+column*step,65+row*step,step,step,BLUE,'FFFFFF')
    for x,name,caption in [(22,'MODIS','About 1 km pixels'),(132,'VIIRS','375 m pixels')]:
        text(s,x,148,95,name,23,27,True,height=12)
        text(s,x,157.5,95,caption,23,27,height=14)
    text(s,234,70,85,'A finer sensor can see more heat signals in the same place.',22,29)
    text(s,234,119,85,'We connect the records so fire seasons are easier to compare.',22,29)
    footer(s,'Pixel-size illustration: the same 3 km view  •  NASA FIRMS MODIS and VIIRS products',2)

    s = slide()
    heading(s,'START WHERE YOU LIVE','Your country, at a glance.')
    picture(s,18,62,155,110,shots+'world-country-panel.png')
    text(s,153,86,33,'Tap',18,23,height=12)
    line=s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,Mm(154),Mm(104),Mm(180),Mm(104))
    line.line.color.rgb=RGBColor.from_string(EMBER);line.line.width=Pt(1.6)
    arrow=s.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ISOSCELES_TRIANGLE,Mm(178),Mm(102.5),Mm(3),Mm(3))
    arrow.rotation=90;arrow.fill.solid();arrow.fill.fore_color.rgb=RGBColor.from_string(EMBER);arrow.line.fill.background()
    arrow._element.spPr.append(OxmlElement('a:effectLst'))
    picture(s,190,64,120,91,shots+'country-card.png')
    text(s,190,159,125,'Choose a satellite and day.',17,22,height=12)
    footer(s,'Recent NASA observations in 242 countries and territories  •  Source dates stay visible',3)

    s = slide()
    heading(s,'LOOK BEYOND TODAY','See the season behind the numbers.')
    picture(s,18,64,198,94,'docs/latex/figures/history-story.png')
    for y,value in [(69,'Explore the seasonal pattern.'),(105,'Reveal the VIIRS observations.'),(141,'Read it in plain words.')]:
        text(s,232,y,88,value,22,28,height=28)
    text(s,18,164,295,'Earlier record: MODIS reconstruction. Reference for comparison: VIIRS observations.',15,19,height=10)
    footer(s,'Historical examples: Bangladesh, Nepal, Chin and Punjab–Haryana  •  Estimates and uncertainty are labeled',4)

    s = slide(True)
    text(s,18,15,290,'FROM OBSERVATIONS TO UNDERSTANDING',12,15,True,'C5CBD1',height=10)
    text(s,18,33,295,'Make the data useful where you live.',35,42,True,'FFFFFF','Cambria',height=30)
    rectangle(s,18,66,160,90,PAPER)
    text(s,25,74,145,'WHAT THIS TELLS YOU',12,15,True,MUTED,height=10)
    reading=(ROOT/'docs/submission/reading.tex').read_text(encoding='utf8').strip()
    reading=reading[len(r'\newcommand{\PlainReading}{'):-1]
    for token in ['%','&','_','#','$']:reading=reading.replace('\\'+token,token)
    text(s,25,88,145,reading,20,27,height=65)
    for y,title,body in [(68,'A student',"can explore their country's pattern."),(107,'A community','can share a dated view of local activity.'),(148,'A researcher','can compare seasons and inspect the evidence.')]:
        text(s,197,y,122,title,21,27,True,'FFFFFF',height=12)
        text(s,197,y+9.5,122,body,21,27,color='E8EBEE',height=24)
    text(s,18,161,160,'Plain words. Source dates attached.',18,23,color='FFFFFF',height=12)
    footer(s,'Designed to support learning, community discussion and seasonal monitoring research',5,True)

    s = slide()
    heading(s,'BUILT FOR EVERYDAY USE','Learn at your pace. Keep it close.')
    picture(s,22,62,58,109,shots+'world-phone.png')
    picture(s,99,62,63,109,shots+'help-phone.png')
    for y,title,body in [(67,'Help on every page.','Pick a topic whenever you need it.'),(111,'A place on your phone.','Save countries. Read cached pages. Share a brief.')]:
        text(s,190,y,126,title,23,30,True,height=13)
        text(s,190,y+10.6,126,body,23,30,height=32)
    text(s,190,156,126,'English and Bangla. Keyboard alternatives. Motion that follows your settings.',16,21,height=18)
    footer(s,'Actual phone captures  •  Saved data keeps its original observation date',6)

    s = slide()
    heading(s,'TEAM KUETaguns',"Your country's fire story\nstarts here.",38,40)
    text(s,18,87,300,'polymathicx.github.io/Agun-Panjika',27,34,color=EMBER,height=20,link='https://polymathicx.github.io/Agun-Panjika/')
    text(s,18,115,298,'Sohaib Hasan Niloy    Ayesha Mehereen    Sarwad Hasan Siddiqui\nAdiba Tahsin    Abdullah Al Saif    Md. Rafsani Shazid',18,25,height=25)
    text(s,18,146,300,'NASA data: FIRMS / LANCE / ESDIS, MODIS and VIIRS. NASA POWER supports the Bangladesh research views.\nCredits: Natural Earth; geoBoundaries; Solar System Scope Earth textures, CC BY 4.0.\nAI-assisted development, design and editing. Actual app recordings and NASA observations.',14,19,height=27)
    footer(s,'Code, data notes and full project documentation  •  Harmonization of MODIS and VIIRS Hot Spots',7,link='https://github.com/polymathicX/Agun-Panjika')

    # Cambria's embedded PDF text map uses U+03D0 for its visible f glyph.
    normalize=lambda value:re.sub(r"[\s•·'’‐‑–—-]+",'',unicodedata.normalize('NFKC',value.replace('\u03d0','f')))
    for i,s in enumerate(deck.slides):
        original=normalize(pdf[i].get_text())
        for shape in s.shapes:
            assert shape.left>=0 and shape.top>=0 and shape.left+shape.width<=deck.slide_width and shape.top+shape.height<=deck.slide_height
            if shape.has_text_frame and shape.text.strip():
                assert normalize(shape.text) in original,(i+1,shape.text)
        s.notes_slide.notes_text_frame.text='Team KUETaguns. Text and diagram objects are editable. Screenshots and the seasonal plot are embedded images. Keep the complete demo within seven slides.'
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    deck.save(OUTPUT)
    reopened=Presentation(OUTPUT)
    assert len(reopened.slides)==7 and all(any(shape.has_text_frame and shape.text.strip() for shape in s.shapes) for s in reopened.slides)
    public=ROOT/'web/public/demo/agun-panjika-slides.pptx'
    shutil.copyfile(OUTPUT,public)
    print(f'Built {OUTPUT.relative_to(ROOT)}: seven slides, editable text and diagrams, source-PDF content checked')


if __name__=='__main__':
    main()
