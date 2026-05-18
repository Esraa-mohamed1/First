path = r'c:\Users\Genius\Desktop\First\src\app\student\courses\[id]\learn\page.tsx'
with open(path, encoding='utf-8') as f:
    lines = f.readlines()

# Lines 1231-1242 (1-indexed) = index 1230-1241 (0-indexed)
replacement = [
    '                                        </div>\n',
    '                                        {comment.replies && comment.replies.length > 0 && (\n',
    '                                          <div className="mt-4 space-y-3 border-r-2 border-blue-100 pr-4">\n',
    '                                            {comment.replies.map(reply => (\n',
    '                                              <div key={reply.id} className="flex gap-3">\n',
    '                                                <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">\n',
    '                                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user?.name || "User"}`} alt="avatar" className="w-full h-full" />\n',
    '                                                </div>\n',
    '                                                <div className="flex-1">\n',
    '                                                  <div className="flex items-center gap-2 mb-1">\n',
    '                                                    <h5 className="font-black text-xs text-gray-900">{reply.user?.name || "طالب درب"}</h5>\n',
    '                                                    <span className="text-[10px] text-gray-400">{new Date(reply.created_at).toLocaleDateString("ar-EG")}</span>\n',
    '                                                  </div>\n',
    '                                                  <p className="text-gray-600 text-xs font-semibold leading-relaxed">{reply.body}</p>\n',
    '                                                </div>\n',
    '                                              </div>\n',
    '                                            ))}\n',
    '                                          </div>\n',
    '                                        )}\n',
    '                                      </div>\n',
    '                                    </div>\n',
    '                                  </div>\n',
    '                                ))}\n',
    '                              </div>\n',
    '                            )}\n',
    '                          </div>\n',
]

lines[1230:1242] = replacement

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed. Total lines:', len(lines))
