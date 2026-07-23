async function start_decode_blog() {
    let language = localStorage.getItem('cloovar_website_language');
    if (language === null) {
        if (navigator.language.startsWith('zh'))
            language = "zh-CN";
        else
            language = "en-US";
    }
    let index_data
    try {
        const response = await fetch('blog_index.json');
        index_data = await response.json();
    } catch (error) {
        console.error('INDEX ERROR WHILE LOADING:', error);
        if (language === "zh-CN") {
            alert("博客索引加载失败! 请刷新页面! ")
        } else {
            alert("Blog index load failed! Please refresh! ")
        }
        return;
    }
    let bc_id = 0;
    const dates = Object.keys(index_data); 

    dates.sort().reverse(); 
    for (const blog_date of dates) {
        const container_cn = document.createElement('div');
        const container_en = document.createElement('div');
        container_cn.id = `blog_container${bc_id}_cn`;
        container_en.id = `blog_container${bc_id}_en`;
        if (!container_cn || !container_en) {
            if (language === "zh-CN") {
                alert("博客创建失败! 请刷新页面! ")
            } else {
                alert("Blog page creation failed! Please refresh! ")
            }
            return;
        }
        container_cn.innerHTML = '';
        container_en.innerHTML = '';
        const fileName = index_data[blog_date];
        let blogData;
        try {
            const blogRes = await fetch(`blogs/${fileName}`);
            blogData = await blogRes.json();
        } catch (error) {
            console.error('BLOG ERROR WHILE LOADING:', error);
            if (language === "zh-CN") {
                alert("博客文件失效! 请刷新页面或等待更新! ")
            } else {
                alert("Blog file corrupted! Please refresh or wait for update! ")
            }
            return;
        }
        let blog_strcuture_cn = blogData["structure_cn"];
        let blog_strcuture_en = blogData["structure_en"];
        for (const element_entry of blog_strcuture_en) {
            const new_element = document.createElement(element_entry[1]);
            if (!(element_entry[0] in blogData)) {
                if (language === "zh-CN") {
                    alert("博客文件失效! 请刷新页面或等待更新! ")
                } else {
                    alert("Blog file corrupted! Please refresh or wait for update! ")
                }
                return;
            }
            if (element_entry[1] === 'img') {
                new_element.src = `img/${blogData[element_entry[0]]}`;
                new_element.style.imageRendering = element_entry[2];
                new_element.title = blogData[element_entry[3]];
                new_element.style.maxWidth = element_entry[4];
                new_element.style.height = 'auto'; 
            }else if (element_entry[1] === 'a') {
                new_element.href = blogData[element_entry[2]];
                new_element.textContent = blogData[element_entry[0]];
                new_element.title = blogData[element_entry[3]];
                new_element.style.display = 'block'; 
                new_element.style.textAlign = 'center';
            } else {
                new_element.textContent = blogData[element_entry[0]];
            }
            container_en.appendChild(new_element);
        }
        for (const element_entry of blog_strcuture_cn) {
            const new_element = document.createElement(element_entry[1]);
            if (!(element_entry[0] in blogData)) {
                if (language === "zh-CN") {
                    alert("博客文件失效! 请刷新页面或等待更新! ")
                } else {
                    alert("Blog file corrupted! Please refresh or wait for update! ")
                }
                return;
            }
            if (element_entry[1] === 'img') {
                new_element.src = `img/${blogData[element_entry[0]]}`;
                new_element.style.imageRendering = element_entry[2];
                new_element.title = blogData[element_entry[3]];
                new_element.style.width = element_entry[4];
                new_element.style.height = 'auto'; 
            }else if (element_entry[1] === 'a') {
                new_element.href = blogData[element_entry[2]];
                new_element.textContent = blogData[element_entry[0]];
                new_element.title = blogData[element_entry[3]];
                new_element.style.display = 'block'; 
                new_element.style.textAlign = 'center';
            } else {
                new_element.textContent = blogData[element_entry[0]];
            }
            container_cn.appendChild(new_element);
        }
        let date_text_en = document.createElement('p');
        let date_text_cn = document.createElement('p');
        date_text_cn.style.color = date_text_en.style.color = "#6f6f6f";
        date_text_cn.style.textShadow = date_text_en.style.textShadow = "0 0px 3px rgba(255, 255, 255, 0)";
        date_text_cn.style.fontSize = date_text_en.style.fontSize = "10px";
        date_text_cn.textContent = date_text_en.textContent = blog_date;
        container_en.appendChild(date_text_en);
        container_cn.appendChild(date_text_cn);

        const hr_en = document.createElement('hr');
        const hr_cn = document.createElement('hr');
        hr_cn.style.width = hr_en.style.width = '40%';
        hr_cn.style.margin = hr_en.style.margin = '30px auto';
        hr_cn.style.border = hr_en.style.border = 'none';
        hr_cn.style.borderTop = hr_en.style.borderTop = '2px solid #222';
        container_en.appendChild(hr_en);
        container_cn.appendChild(hr_cn);
        document.getElementById('blog_list_en').appendChild(container_en);
        document.getElementById('blog_list_cn').appendChild(container_cn);
        bc_id += 1;
    }
}
